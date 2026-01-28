const express = require('express');
const { promptChatBot, getConversationHistory, deleteConversationHistory } = require('../../controllers/ChatBot.controller');
const { auth } = require('../../middleware/authentication');
const router = express.Router();


router.post('/', promptChatBot);
router.get('/', auth, getConversationHistory);
router.delete('/:userId', deleteConversationHistory);

module.exports = router;