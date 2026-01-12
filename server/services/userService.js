const { ValidationError, NotFoundError } = require("../helpers/errors");
const GameHistory = require("../models/GameHistory.model");
const User = require("../models/User.model");

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

    return {
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
}

module.exports = new UserService();