const mongoose = require("mongoose");

const gameHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    gameType: {
        type: String,
        enum: ['slots', 'roulette'],
        required: true,
    },
    betAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    winAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    netProfit: {
        type: Number,
        required: true,
    }, 
    result: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    balanceBefore: {
        type: Number,
        required: true,
    },
    balanceAfter: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    }
});

gameHistorySchema.index({ userId: 1, timestamp: -1 });
gameHistorySchema.index({ gameType: 1, timestamp: -1 });

const GameHistory = mongoose.model('GameHistory', gameHistorySchema);
module.exports = GameHistory;