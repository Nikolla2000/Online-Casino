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
            gameType: 'slots',
            gameId: data.gameId,
            timestamp: new Date()
        })       
    } catch (err) {
        console.error('Error saving transaction:', err);
    }
}

module.exports = {
    saveTransaction
}