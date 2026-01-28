const express = require('express');
const router = express.Router();
const {
  getUserChats,
  getChatMessages,
  createChat,
  markMessagesAsRead,
  deleteChat
} = require('../../controllers/Chat.controller.js');
const { verifyJWT } = require('../../middleware/authentication.js');

// Apply auth middleware to all routes
router.use(verifyJWT);

router.get('/', getUserChats);
router.post('/', createChat);
router.get('/:chatId/messages', getChatMessages);
router.put('/:chatId/messages/read', markMessagesAsRead);
router.delete('/:chatId', deleteChat);

module.exports = router;