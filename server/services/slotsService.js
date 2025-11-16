class SlotsService {
 
  /**
   * @param {string} userId - User ID from JWT middleware
   * @param {number} betAmount - Amount to bet
   * @returns {object} Game result
   */

  async playRound(userId, betAmount) {
    
    this
  }

  validateBet(betAmount) {
    if (!betAmount || typeof betAmount !== 'number') {
      const error = new Error('Invalid bet amount');
      error.statusCode = 400;
      throw error;
    }

    if (betAmount <= 0) {
      const error = new Error('Bet amount must be positive');
      error.statusCode = 400;
      throw error;
    }

    const MIN_BET = 100;
    const MAX_BET = 1000;

    if (betAmount < MIN_BET || betAmount > MAX_BET) {
      const error = new Error(`Bet must be between ${MIN_BET} and ${MAX_BET}`);
      error.statusCode = 400;
      throw error;
    }
  }
}