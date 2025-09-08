const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
    .populate('participants', 'username email profileImage isVip totalCredits')
    .populate({
      path: 'lastMessage',
      select: 'content senderId createdAt'
    })
    .sort({ lastActivity: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get chat messages
// @route   GET /api/chats/:chatId/messages
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat'
      });
    }

    const messages = await Message.find({ chatId })
      .populate('senderId', 'username profileImage')
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new chat
// @route   POST /api/chats
// @access  Private
const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, receiverId] }
    }).populate('participants', 'username email profileImage isVip totalCredits');

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, receiverId]
      });
      await chat.save();
      await chat.populate('participants', 'username email profileImage isVip totalCredits');
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/:chatId/messages/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { messageIds } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        chatId,
        senderId: { $ne: req.user.id },
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chats/:chatId
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Message.deleteMany({ chatId });
    
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getUserChats,
  getChatMessages,
  createChat,
  markMessagesAsRead,
  deleteChat
};