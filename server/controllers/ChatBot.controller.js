const Groq = require("groq-sdk");
const User = require("../models/User.model");
const ChatbotMessage = require("../models/ChatbotMessage.model");

const groq = new Groq({ apiKey: process.env.GROQ_AI_API_KEY });


const promptChatBot = async (req, res)  => {
  const { message, userId } = req.body;

  if (!message) return res.status(400).json({ message: "Message is required" });
  let guestMode = true;
  let username = null;

  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        guestMode = false;
        username = user.firstName;
      }
    } catch (err) {
      console.error("Database error:", err);
    }
  }

  const systemPrompt = guestMode 
  ? process.env.GROQ_AI_GUEST_PROMPT
  : `${process.env.GROQ_AI_LOGGED_IN_PROMPT}\n\nThe user's name is ${username}. Use their name occasionally to make the conversation more personal.`;

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

    res.json({
      response: aiResponse,
      guestMode: guestMode,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({ message: "AI service unavailable" });
  }

}

module.exports = {
  promptChatBot,
}
