const Groq = require("groq-sdk");
const User = require("../models/User.model");
const ChatbotMessage = require("../models/ChatbotMessage.model");

const groq = new Groq({ apiKey: process.env.GROQ_AI_API_KEY });


/**
 * Send a message to AI chatbot and get response
 * 
 * @route POST /server/v1/chatbot
 * @access Public/Private (guest or authenticated)
 * @param {string} message - User message to send to chatbot
 * @param {string} [userId] - Optional user ID for authenticated users
 * @returns {Promise<void>} sends JSON response with AI reply
 * @throws {400} If message is missing
 * @throws {500} If AI service or database fails
 */
const promptChatBot = async (req, res)  => {
  const { message, userId } = req.body;

  if (!message) return res.status(400).json({ message: "Message is required" });
  let guestMode = true;
  let username = null;
  let totalCredits = null;

  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        guestMode = false;
        username = user.firstName;
        totalCredits = user.totalCredits;
      }
    } catch (err) {
      console.error("Database error:", err);
    }
  }

  const systemPrompt = guestMode 
  ? `${process.env.GROQ_AI_GUEST_PROMPT}\n\n${process.env.ADDITIONAL_INFO}`
  : `${process.env.GROQ_AI_LOGGED_IN_PROMPT}\n\nThe user's name is ${username}. Use their name occasionally to make the conversation more personal. The user could ask how much total credits he has. He has ${totalCredits} credits\n\n${process.env.ADDITIONAL_INFO}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: process.env.GROQ_AI_MODEL,
    });
  
    const aiResponse = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    if (!guestMode) {
      try {
        await ChatbotMessage.create({
          userId: userId,
          userMessage: message,
          aiResponse: aiResponse,
          timeStamp: new Date()
        });
      } catch (err) {
        console.error("Failed to save chat history:", err);
      }
    }

    return res.json({
      response: aiResponse,
      guestMode: guestMode,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Groq API error:", err);
    return res.status(500).json({ message: "AI service unavailable" });
  }

}


/**
 * Get conversation history for authenticated user
 * 
 * @route GET /server/v1/chatbot/
 * @access Private
 * @returns {Promise<void>} sends JSON array of message history
 * @throws {401} not authenticated
 * @throws {500} database error
 */
const getConversationHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversationHistory = await ChatbotMessage.find({ userId })
      .select('userMessage aiResponse timeStamp')
      .limit(100)

    return res.status(200).json(conversationHistory);
  } catch (err) {
    console.error("Error retrieving conversation history: ", err);
    return res.status(500).json({ error: 'Failed to retrieve conversation history'});
  }
}


/**
 * Delete conversation history for authenticated user
 * 
 * @route DELETE /server/v1/chatbot/:userId
 * @access Private
 * @returns {Promise<void>} sends JSON: {message: "Successfully deleted..."}
 * @throws {500} database error
 */
const deleteConversationHistory = async (req, res) => {
  const userId = req.params.userId;

  if (!userId || userId === 'undefined' || userId === 'null') {
    return res.status(400).json({ error: 'Valid user ID is required' });
  }

  try {
    await ChatbotMessage.deleteMany({ userId: userId })

    return res.status(200).json({ message: "Successfully deleted conversation history" });
  } catch (err) {
    console.error("Delete conversation history error: ", err);
    return res.status(500).json({ error: 'Failed to delete conversation history'});
  }

}

module.exports = {
  promptChatBot,
  getConversationHistory,
  deleteConversationHistory,
}
