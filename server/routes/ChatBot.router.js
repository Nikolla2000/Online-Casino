const express = require('express');
const { promptChatBot, getConversationHistory } = require('../controllers/ChatBot.controller');
const { auth } = require('../middleware/authentication');
const router = express.Router();

// @route   POST /chatbot
// @desc    Prompt the ai chatbot with a message
// @access  Public
// @body    {message: string}
// @returns {aiResponse: string}
router.post('/', promptChatBot);


// @route   GET /chatbot
// @desc    Get the conversation history of the user with the chatbot
// @access  Protected
// @body    {}
// @returns { conversationHistory: { 
                                    // userMessage: string,
                                    //  aiResponse: string,
                                    //  timeStamp: date  }}
router.get('/', auth, getConversationHistory);



module.exports = router;