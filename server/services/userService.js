const { ValidationError, NotFoundError, ConflictError } = require("../helpers/errors");
const { AppError } = require("../middleware/errorHandler");
const Blocking = require("../models/Blocking.model");
const GameHistory = require("../models/GameHistory.model");
const User = require("../models/User.model");
const { registerSchema } = require("../validation-schemas/user.schema");

class UserService {
  
  /**
   * Retrieves a filtered list of game history objects for a specific user.
   * Filters for games since specific date and to a certain limit.
   * @param {string} userId 
   * @param {number} limit - Limit of game history objects to be returned.
   * @param {number} sinceDate 
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of lean gameHistory objects.
   * @throws {Error} If database query fails.
   */
  async recentActivity(userId, limit = 4, sinceDate) {
    const targetDate = sinceDate || new Date(new Date().setMonth(new Date().getMonth() - 1));

    return await GameHistory.find({
      userId,
      timestamp: { $gte: targetDate }
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
  }

  /**
   * 
   * @param {string} userId 
   * @param {number} page - The current page
   * @param {number} limit - Items per page
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of lean gameHistory objects.
   * @throws {Error} If database query fails.
   */
  async gameHistory(userId, page, limit) {
    const MAX_RECORDS = 200; 

    const skip = (page - 1) * limit;

    /**
     * Caching strategy:
     * Caching only first page (1-10 records) because:
     * - 90% of views are only for this first page
     * - Avoids cache bloat from storing rarely-accessed pagination data
     * - Reduces Redis memory usage for rarely viewwed pages
     * - Cache invalidated after each game to ensure fresh data on page 1
     */
    const shouldCache = page === 1 && limit === 10;
    const cacheKey = `user:history:${userId}`;

    if (shouldCache) {
      const cached = await redis.get(cacheKey).catch(() => null)
      if (cached) {
        return JSON.parse(cached);
      }
    }

    const totalCount = await GameHistory.countDocuments({ userId });
    const limitedTotal = Math.min(totalCount, MAX_RECORDS);
    const totalPages = Math.ceil(limitedTotal / limit);

    if (page > totalPages && totalPages > 0) {
      throw new ValidationError(`Page ${page} out of range. Total pages: ${totalPages}`);
    }

    const history = await GameHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(Math.min(skip + limit, MAX_RECORDS))
      .skip(skip)
      .lean();

    const result = {
      history,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: limitedTotal,
        recordsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }

    if (shouldCache) {
      await redis.setEc(cacheKey, 120, JSON.stringify(result));
    }

    return result;
  }


  /**
   * Retrieves a list of users with optional filtering. Returns selected fields only for security and performance.
   * 
   * @param {Object} options - Filter and sort options
   * @param {boolean} [options.onlineOnly=false] - If true, returns only users with isOnline=true
   * @param {boolean} [options.vipOnly=false] - If true, returns only VIP users
   * @param {number} [options.limit] - Maximum number of users to return (optional)
   * @param {string} [options.sortBy='username'] - Field to sort by ('username', 'totalCredits', 'lastSeen')
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of lean user objects
   * @throws {ValidationError} If invalid sort field is provided
   * @throws {Error} If database query fails.
   */
  async getUsers(options = {}) {
    const {
      onlineOnly = false,
      vipOnly = false,
      limit,
      sortBy = 'username'
    } = options;  

    const validSortFields = ['username', 'totalCredits', 'lastSeen', 'registrationDate'];
    if (!validSortFields.includes(sortBy)) {
      throw new ValidationError(
        `Invalid sort field: ${sortBy}. Valid options: ${validSortFields.join(', ')}`
      );
    }

    const MAX_LIMIT = 100;
    if (limit !== undefined) {
      const parsedLimit = parseInt(limit);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        throw new ValidationError('Limit must be a positive number');
      }
      if (parsedLimit > MAX_LIMIT) {
        throw new ValidationError(`Limit cannot exceed ${MAX_LIMIT}`);
      }
    }

    const filters = {};
    if (onlineOnly) filters.isOnline = true;
    if (vipOnly) filters.isVip = true;

    const sortOrder = sortBy === 'totalCredits' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };

    let query = User.find(
      filters
    )
    .select('-password')
    .sort(sortObj);

    if (limit && limit > 0) {
      query = query.limit(Math.min(parseInt(limit), MAX_LIMIT));
    }

    const users = await query.lean();

    return users;
  }


  /**
 * Updates total credits for a user
 * @param {string} userId - User ID to update
 * @param {number} totalCredits - New total credits amount
 * @param {string} adminId - Admin user ID who is making the update
 * @returns {Promise<Object>} Updated user info
 * @throws {NotFoundError} If user not found
 * @throws {ValidationError} If credits value is invalid
 * @throws {Error} If user doesn't have admin role
 */
  async updateTotalCredits(userId, totalCredits, adminId) {
    if (totalCredits === undefined || totalCredits === null) {
      throw new ValidationError('totalCredits field is required');
    }
    
    if (typeof totalCredits !== 'number' || isNaN(totalCredits)) {
      throw new ValidationError('totalCredits must be a valid number');
    }
    
    if (totalCredits < 0) {
      throw new ValidationError('totalCredits cannot be negative');
    }
    
    const MAX_TOTAL_CREDITS_SET = 100000 // 100 Thousand
    if (totalCredits > MAX_TOTAL_CREDITS_SET) {
      throw new ValidationError('totalCredits cannot exceed 100 000');
    }

    const adminUser = await User.findById(adminId).select('role');

    if (!adminUser) {
      throw new NotFoundError('Admin');
    }

    if (adminUser.role !== 'admin') {
      throw new AppError('Access denied. Admin role required to update credits.', 403);
    }

    const userToUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { 
        $set: { 
          totalCredits: totalCredits,
        } 
      },
      { 
        new: true,
        select: '-password'
      }
    );

    if (!userToUpdate) {
      throw new NotFoundError('User not found');
    }

    return {
      id: userToUpdate._id,
      username: userToUpdate.username,
      email: userToUpdate.email,
      totalCredits: userToUpdate.totalCredits,
    };
  }


/**
 * Get total credits for an user
 * @param {string} userId - User ID to get credits for
 * @returns {Promise<Object>} User credits info
 * @throws {NotFoundError} If user not found
 */
  async getTotalCredits(userId) {
    const user = await User.findById(userId).select('totalCredits').lean();

    if (!user) {
      throw new NotFoundError('User');
    }

    return { totalCredits: user.totalCredits };
  }


  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data 
   * @param {string} userData.firstName 
   * @param {string} userData.lastName 
   * @param {string} userData.email 
   * @param {string} userData.password 
   * @param {string} userData.confirmPassword 
   * @param {Date} userData.registraionDate (Optional)
   * @param {string} userData.country (Optional)
   * @param {string} userData.phoneNumber (Optional)
   * @return {Promise<Object>} Credted user info
   * @throws {ValidationError} If validation fails
   * @throws {ConflictError} If user with email/username already exists
   */
  async register(userData) {
    const validatedData = registerSchema.parse(userData);

    const existingUser = await User.findOne({
      $or: [
        { username: validatedData.username.toLowerCase() },
        { email: validatedData.email.toLowerCase() }
      ]
    }).select('_id username email');

    if (existingUser) {
      const conflictField = existingUser.username === username.toLowerCase() ? 'username' : 'email';
      throw new ConflictError(`User with this ${conflictField} already exists`);
    }

    const newUser = await User.create({
      ...validatedData,
      password: validatedData.password
    });

    return this.sanitizeUser(newUser);
  }


  sanitizeUser(user) {
    const { password, __v, ...sanitized } = user.toObject();
    return sanitized;
  }


  async getProfileById(targetUserId, currentUserId) {
    const user = await User.findById(targetUserId)
      .select('-password -email -oauthProvider -oauthId -hasPassword -totalCredits -refreshToken -bonusOffers -gameUpdates -vipEvents');

    if (!user) {
      throw new NotFoundError('User');
    }

    let isBlocked = false;

    const blockingRecord = await Blocking.findOne({ blockerId: currentUserId, blockedId: targetUserId });
    isBlocked = !!blockingRecord;

    const userObject = user.toObject();
    userObject.isBlocked = isBlocked;
  
    return userObject;
  }
}

module.exports = new UserService();