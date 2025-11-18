const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['slots_bet', 'slots_win', 'roulette_bet', 'roulette_win', 'deposit', 'withdrawal'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    balanceBefore: {
        type: Number,
        required: true,
    },
    balanceAfter: {
        type: Number,
        required: true,
    },
    gameType: {
        type: String,
        enum: ['slots', 'roulette'],
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GameHistory',
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    }
});

transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ type: 1, timestamp: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;