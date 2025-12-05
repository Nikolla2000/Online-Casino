const Transaction = require("../models/Transaction.model");

/**
 * Save transaction to database
 */
const saveTransaction = async (data) => {
    try {
        return await Transaction.create({
            userId: data.userId,
            type: data.type,
            amount: data.amount,
            balanceBefore: data.balanceBefore,
            balanceAfter: data.balanceAfter,
            gameType: data.gameType,
            gameId: data.gameId,
            timestamp: new Date()
        })       
    } catch (err) {
        console.error('Error saving transaction:', err);
    }
}

// Valid chip values for roulette
const VALID_CHIP_VALUES = [5, 10, 25, 50, 100];

const isValidChipValue = (amount) => {
  return VALID_CHIP_VALUES.includes(amount);
};

/**
 * Ensure integer
 */
const formatCredits = (amount) => {
    return Math.floor(amount);
  };

/**
 * Validate user exists and has enough credits
 */
const validateUserAndCredits = async (userId, betAmount, User) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    if (user.totalCredits < betAmount) {
        const error = new Error('Insufficient credits');
        error.statusCode = 400;
        throw error;
    }

    return user;
}

module.exports = {
    saveTransaction,
    validateUserAndCredits,
    isValidChipValue,
    formatCredits
}