const express = require('express');
const { promptChatBot, getConversationHistory, deleteConversationHistory } = require('../../controllers/ChatBot.controller');
const { auth } = require('../../middleware/authentication');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: AI Chatbot endpoints (powered by Groq)
 */

/**
 * @swagger
 * /v1/chatbot:
 *   post:
 *     summary: Send a message to the AI chatbot
 *     tags: [Chatbot]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "What games do you offer?"
 *               userId:
 *                 type: string
 *                 description: Optional - if provided, personalizes response and saves history
 *                 example: "64abc123def456"
 *     responses:
 *       200:
 *         description: AI response returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "We offer slots and roulette!"
 *                 guestMode:
 *                   type: boolean
 *                   example: false
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-01T12:00:00.000Z"
 *       400:
 *         description: Message is required
 *       500:
 *         description: AI service unavailable
 */
router.post('/', promptChatBot);

/**
 * @swagger
 * /v1/chatbot:
 *   get:
 *     summary: Get conversation history for authenticated user
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns last 100 messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userMessage:
 *                     type: string
 *                   aiResponse:
 *                     type: string
 *                   timeStamp:
 *                     type: string
 *                     example: "2024-01-01T12:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve conversation history
 */
router.get('/', auth, getConversationHistory);

/**
 * @swagger
 * /v1/chatbot:
 *   delete:
 *     summary: Delete all conversation history for authenticated user
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversation history deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully deleted conversation history"
 *       500:
 *         description: Failed to delete conversation history
 */
router.delete('/', auth, deleteConversationHistory);

module.exports = router;