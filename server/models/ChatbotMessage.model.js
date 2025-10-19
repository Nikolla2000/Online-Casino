const mongoose = require('mongoose');

const chatbotMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
    min: 1,
    max: 2000,
    trim: true,
  },
  aiResponse: {
    type: String,
    required: true,
    trim: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  tokenUsed: {
    type: Number,
    default: 0,
  }
});

chatbotMessageSchema.index({ userId: 1, timeStamp: 1 });

const ChatbotMessage = mongoose.model('ChatbotMessage', chatbotMessageSchema);
module.exports = ChatbotMessage;