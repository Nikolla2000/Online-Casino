const { default: mongoose } = require("mongoose");

const blockingSchema = new mongoose.Schema({
    blockerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blockedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

blockingSchema.index({ blockerId: 1 });
blockingSchema.index({ blockedId: 1 });
blockingSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

const Blocking = mongoose.model('Blocking', blockingSchema);
module.exports = Blocking;