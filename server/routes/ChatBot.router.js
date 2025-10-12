const express = require('express');
const { promptChatBot } = require('../controllers/ChatBot.controller');
const router = express.Router();

// @route   POST /chatbot
// @desc    Prompt the ai chatbot with a message
// @access  Public
// @body    {message: string}
// @returns {aiResponse: string}
router.post('/', promptChatBot);

module.export = router;