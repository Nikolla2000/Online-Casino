const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');


/**
 * Get all chats for the authenticated user
 * 
 * @route GET /server/v1/chats
 * @access Private
 * @returns {Promise<void>} sends JSON response with user chats
 */
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId
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

/**
 * Get messages for a specific chat
 * 
 * @route GET /server/v1/chats/:chatId/messages
 * @access Private
 * @param {string} chatId - ID of the chat to fetch messages from
 * @returns {Promise<void>} sends JSON response with chat messages
 */
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.userId)) {
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

/**
 * Create a new chat or return existing chat with specified user
 * 
 * @route POST /server/v1/chats
 * @access Private
 * @param {string} receiverId - ID of the receiver of the message
 * @returns {Promise<void>} sends JSON response with chat object
 */
const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.userId, receiverId] }
    }).populate('participants', 'username email profileImage isVip totalCredits');

    if (!chat) {
      chat = new Chat({
        participants: [req.userId, receiverId]
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

/**
 * Mark messages as read in a specific chat
 * 
 * @route PUT /server/v1/chats/:chatId/messages/read
 * @access Private
 * @param {string} chatId - ID of the chat containing messages
 * @param {string} messageIds - ID of the messages to be read
 * @returns {Promise<void>} sends JSON response indicating success
 */
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { messageIds } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        chatId,
        senderId: { $ne: req.userId },
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

/**
 * Delete a chat and all associated messages
 * 
 * @route DELETE /server/v1/chats/:chatId
 * @access Private
 * @param {string} chatId - ID of the chat to delete
 * @returns {Promise<void>} sends JSON response indicating success or error
 */
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

    if (!chat.participants.includes(req.userId)) {
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