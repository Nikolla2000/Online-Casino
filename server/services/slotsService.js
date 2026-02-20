const { saveTransaction } = require("../helpers/gameHelpers");
const GameHistory = require("../models/GameHistory.model");
const User = require("../models/User.model");
const redis = require('../config/redis');

class SlotsService {

  /**
   * @param {string} userId - User ID from JWT middleware
   * @param {number} betAmount - Amount to bet
   * @returns {object} Game result
   */
  async playRound(userId, betAmount) {
    
    this.validateBet(betAmount);

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.totalCredits < betAmount) {
      const error = new Error('Not enough credits');
      error.statusCode = 400;
      throw error;
    }

    const reels = this.generateSlotReels();

    const { winAmount, winningLines, multiplier } = this.calculateWin(reels, betAmount);

    const balanceBefore = user.totalCredits;
    const netProfit = winAmount - betAmount;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalCredits: netProfit,
          totalWagered: betAmount,
          totalWon: winAmount,
          gamesPlayed: 1,
        }
      },
      { new: true }
      );

    const balanceAfter = updatedUser.totalCredits;
      
    const SAVE_HISTORY = process.env.NODE_ENV == 'production';
    let gameHistory = null;

    if (SAVE_HISTORY) {
      gameHistory = await GameHistory.create({
        userId,
        gameType: 'slots',
        betAmount,
        winAmount,
        netProfit,
        result: {
          reels,
          winningLines,
          multiplier
        },
        balanceBefore,
        balanceAfter,
        timestamp: new Date()
      });
  
      await saveTransaction({
        userId,
        type: 'slots_bet',
        amount: -betAmount,
        balanceBefore,
        balanceAfter: balanceBefore - betAmount,
        gameType: 'slots',
        gameId: gameHistory._id
      });
  
      if (winAmount > 0) {
        await saveTransaction({
          userId,
          type: 'slots_win',
          amount: winAmount,
          balanceBefore: balanceBefore - betAmount,
          balanceAfter,
          gameType: 'slots',
          gameId: gameHistory._id
        });
      }
    }

    await redis.del(`user:stats:${userId}`).catch(err => {
      console.warn('Failed to invalidate stats cache:', err);
    })

    await redis.del(`user:history:${userId}`).catch(err => {
      console.warn('Failed to invalidate history cache:', err);
    });

    await redis.del(`user:recent-activity:${userId}`).catch(() => {});

    return {
      success: true,
      betAmount,
      winAmount,
      netProfit,
      multiplier,
      reels,
      winningLines,
      balanceBefore,
      balanceAfter,
      isWin: winAmount > 0,
      gameId: gameHistory?._id || null
    };
  }

  /**
   * Validate bet amount
   * @param {number} betAmount
   * @returns {void}
   */
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

  /**
   * Generate 3x5 slot reels (numbers 1-12)
   * @returns {number[][]} 2D array of slot symbols
   */
  generateSlotReels() {
    const rows = [];

    for (let row = 0; row < 3; row++) {
      const cols = [];

      for (let col = 0; col < 5; col++) {
        const symbol = Math.floor(Math.random() * 12) + 1;
        cols.push(symbol);
      }

      rows.push(cols);
    }

    return rows;
  }

  /** Calculate win amount and identify winning linies
   * @param {number[][]} reels - the generated 3x5 array of symbols
   * @param {number} betAmount - Bet amount
   * @returns {object} Win details
   */
  calculateWin(reels, betAmount) {
    const winningLines = [];
    let totalMultiplier = 0;

    const paylines = this.getPaylines();

    for (let i = 0; i < paylines.length; i++) {
      const payline = paylines[i];
      const lineMultiplier = this.checkPayLine(reels, payline.positions);

      if (lineMultiplier > 0) {
        winningLines.push({
          lineNumber: i + 1,
          pattern: payline.name,
          multiplier: lineMultiplier,
          symbols: this.getLineSymbols(reels, payline.positions)
        });
        totalMultiplier += lineMultiplier;
      }
    }

    const winAmount = Math.floor(betAmount * totalMultiplier);

    return {
      winAmount,
      winningLines,
      multiplier: totalMultiplier
    };
  }

  /**
   * Get all winning patterns
   */
  getPaylines() {
    return [
      {
        name: 'Top Row',
        positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
      },
      {
        name: 'Middle Row',
        positions: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]]
      },
      {
        name: 'Bottom Row',
        positions: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]
      },
      {
        name: 'Diagonal Down',
        positions: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]]
      },
      {
        name: 'Diagonal Up',
        positions: [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]]
      },
      {
        name: 'V Pattern',
        positions: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]]
      },
      {
        name: 'Inverted V',
        positions: [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]]
      },
      {
        name: 'Zigzag 1',
        positions: [[1, 0], [0, 1], [1, 2], [2, 3], [1, 4]]
      },
      {
        name: 'Zigzag 2',
        positions: [[1, 0], [2, 1], [1, 2], [0, 3], [1, 4]]
      }
    ];
  }

  /**
   * Check if a payline has matching symbols
   * @param {number[][]} reels
   * @param {number[][]} positions - Array of [row, col] positions
   * @returns {number} Multiplier (0 if no win)
   */
  checkPayLine(reels, positions) {
    const symbols = positions.map(([row, col]) => reels[row][col]);

    const firstSymbol = symbols[0];
    let matchCount = 1;

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol) {
        matchCount++;
      } else {
        break;
      }
    }

    return this.getMultiplier(firstSymbol, matchCount);
  }

  /**
   * Get symbols on a specific line
   */
  getLineSymbols(reels, positions) {
    return positions.map(([row, col]) => reels[row][col]);
  }

  /**
   * Get win multiplier based on symbol and match count
   * @param {number} symbol - Symbol number (1-12)
   * @param {number} matchCount - Number of matching symbols
   * @returns {number} Multiplier
   */
  getMultiplier(symbol, matchCount) {
    // Symbol values (higher symbols = better payout)
    const symbolValues = {
      12: { 5: 100, 4: 20, 3: 5, 2: 1.5 },   // Diamond (highest)
      11: { 5: 80, 4: 15, 3: 4, 2: 1.2 },    // Seven
      10: { 5: 60, 4: 12, 3: 3, 2: 1 },      // Star
      9: { 5: 40, 4: 10, 3: 2.5, 2: 0.8 },   // Bell
      8: { 5: 30, 4: 8, 3: 2, 2: 0.6 },      // Watermelon
      7: { 5: 25, 4: 6, 3: 1.5, 2: 0.5 },    // Grapes
      6: { 5: 20, 4: 5, 3: 1.2, 2: 0.4 },    // Orange
      5: { 5: 15, 4: 4, 3: 1, 2: 0.3 },      // Lemon
      4: { 5: 12, 4: 3, 3: 0.8, 2: 0.25 },   // Cherry
      3: { 5: 10, 4: 2.5, 3: 0.6, 2: 0.2 },  // Plum
      2: { 5: 8, 4: 2, 3: 0.5, 2: 0.15 },    // Ace
      1: { 5: 5, 4: 1.5, 3: 0.3, 2: 0.1 }    // King (lowest)
    };

    // Get multiplier for this symbol and match count
    const symbolPayouts = symbolValues[symbol] || symbolValues[1];
    
    if (matchCount >= 5) return symbolPayouts[5] || 0;
    if (matchCount >= 4) return symbolPayouts[4] || 0;
    if (matchCount >= 3) return symbolPayouts[3] || 0;
    if (matchCount >= 2) return symbolPayouts[2] || 0;
    
    return 0; // No win
  }
}

module.exports = new SlotsService();