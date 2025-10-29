import { useEffect, useState, useRef } from "react"
import "./AIChatStyles.scss";
import { fetchConversationHistory, promptChatBot } from "../../services/api/chatBotAPI";
import { useDispatch, useSelector } from "react-redux";
import { hideChat, setConversationHistory, addMessage, startChatbotTyping, stopChatbotTyping } from "../../redux/features/aiChatbot/aiChatbotSlice";
import ConversationHistory from "./ConversationHistory";

const AIChatWidget = () => {
  const { user, accessToken } = useSelector(state => state.auth);
  const { conversationHistory, isChatbotTyping } = useSelector(state => state.aiChatbot);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({
    message: '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, isChatbotTyping]);

  useEffect(() => {
    const getConversationHistory = async () => {
      try {
        const data = await fetchConversationHistory();
        dispatch(setConversationHistory(data));
      } catch (error) {
        console.error("Failed to fetch conversation history:", error);
      }
    }

    if(user && accessToken) {
      getConversationHistory();
    }
  }, [user, accessToken, dispatch]);

  const handleChange = (e) => {
    setFormData({
      message: e.target.value
    });
  }

  const handleClose = () => {
    dispatch(hideChat());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const userId = user?._id || null;
    const userMessage = formData.message;

    const tempUserMessage = {
      _id: Date.now().toString(),
      userMessage: userMessage,
      aiResponse: "",
      timeStamp: new Date().toISOString(),
      isTemp: true
    };
    
    dispatch(addMessage(tempUserMessage));
    setFormData({ message: '' });

    try {
      dispatch(startChatbotTyping());
      
      const res = await promptChatBot({
        message: userMessage,
        userId: userId,
      });

      dispatch(setConversationHistory([
        ...conversationHistory,
        {
          userMessage: userMessage,
          aiResponse: res.response,
          timeStamp: new Date().toISOString()
        }
      ]));

    } catch (err) {
      console.error('Message submission failed:', err);
      dispatch(setConversationHistory(conversationHistory.filter(msg => !msg.isTemp)));
    } finally {
      dispatch(stopChatbotTyping());
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="ai-chat-widget">
      <div className="chat-header">
        <div className="chat-title">
          <div className="ai-avatar">🤖</div>
          <div className="title-text">
            <h3>AI Casino Assistant</h3>
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
        <button className="close-btn" onClick={handleClose}>
          <span>×</span>
        </button>
      </div>

      <ConversationHistory />
      
      {isChatbotTyping && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>AI is typing...</span>
        </div>
      )}
      
      <div ref={messagesEndRef} />

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input 
            type="text" 
            name="message" 
            className="message-input" 
            value={formData.message} 
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about games, strategies, or anything casino-related..."
            required 
          />
          <button type="submit" className="send-btn" disabled={!formData.message.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AIChatWidget;