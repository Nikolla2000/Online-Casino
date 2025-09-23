const express = require('express');
const router = express.Router();
const {
  getUserChats,
  getChatMessages,
  createChat,
  markMessagesAsRead,
  deleteChat
} = require('../controllers/Chat.controller');
const { auth, verifyJWT } = require('../middleware/authentication.js');

// Apply auth middleware to all routes
// router.use(auth);

// @route   GET /api/chats
// @desc    Get all chats for authenticated user
// @access  Private
router.get('/', getUserChats);

// @route   POST /api/chats
// @desc    Create new chat
// @access  Private
router.post('/', createChat);

// @route   GET /api/chats/:chatId/messages
// @desc    Get messages for specific chat
// @access  Private
router.get('/:chatId/messages', auth, getChatMessages);

// @route   PUT /api/chats/:chatId/messages/read
// @desc    Mark messages as read
// @access  Private
router.put('/:chatId/messages/read', markMessagesAsRead);

// @route   DELETE /api/chats/:chatId
// @desc    Delete chat and all messages
// @access  Private
router.delete('/:chatId', deleteChat);

module.exports = router;