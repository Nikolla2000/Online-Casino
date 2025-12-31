const { ValidationError } = require("../helpers/errors");
const GameHistory = require("../models/GameHistory.model");

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
   * @param {number} page - Starting page - needed for pagination.
   * @param {number} limit - The number of gameHistory objects to be returned on a page
   * @param {number} maxRecords - Max number of records to return.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of lean gameHistory objects.
   * @throws {Error} If database query fails.
   */
  async gameHistory(userId, page = 1, limit = 10, maxRecords = 200) {
    const skip = (page - 1) * limit;

    const totalCount = await GameHistory.countDocuments({ userId });
    const limitedTotal = Math.min(totalCount, maxRecords);
    const totalPages = Math.ceil(limitedTotal / limit);

    if (page > totalPages && totalPages > 0) {
      throw new ValidationError('Page out of range');
    }

    const history = await GameHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(Math.min(skip + limit, maxRecords))
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
}

module.exports = new UserService();