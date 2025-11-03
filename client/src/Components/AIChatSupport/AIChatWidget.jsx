import { useEffect, useState, useRef } from "react"
import "./AIChatStyles.scss";
import { fetchConversationHistory, promptChatBot } from "../../services/api/chatBotAPI";
import { useDispatch, useSelector } from "react-redux";
import { hideChat, setConversationHistory, addMessage, startChatbotTyping, stopChatbotTyping, hideQuickQuestions, setShowQuickQuestions } from "../../redux/features/aiChatbot/aiChatbotSlice";
import ConversationHistory from "./ConversationHistory";

const AIChatWidget = () => {
  const { user, accessToken } = useSelector(state => state.auth);
  const { conversationHistory, isChatbotTyping, showQuickQuestions } = useSelector(state => state.aiChatbot);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({
    message: '',
  });

  const quickQuestions = [
    "How many credits do I have?",
    "How was this website created?",
    "Are the games real?",
    "How is this AI created?",
    "What are the roulette odds?",
    "How to manage my bankroll?",
  ];

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
    dispatch(hideQuickQuestions());
  }

  const submitMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userId = user?._id || null;

    const tempUserMessage = {
      _id: Date.now().toString(),
      userMessage: messageText,
      aiResponse: "",
      timeStamp: new Date().toISOString(),
      isTemp: true
    };
    
    dispatch(addMessage(tempUserMessage));
    setFormData({ message: '' });
    dispatch(hideQuickQuestions());

    try {
      dispatch(startChatbotTyping());
      
      const res = await promptChatBot({
        message: messageText,
        userId: userId,
      });

      dispatch(setConversationHistory([
        ...conversationHistory,
        {
          userMessage: messageText,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitMessage(formData.message)
  }

  const handleQuickQuestionClick = async (question) => {
    submitMessage(question);
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
        
        <div className="header-actions">
          <div className="quick-questions-toggle">
            <button 
              className={`menu-toggle-btn ${showQuickQuestions ? 'active' : ''}`}
              onClick={() => {
                if (showQuickQuestions) {
                  dispatch(hideQuickQuestions());
                } else {
                  dispatch(setShowQuickQuestions());
                }
              }}
              title="View frequently asked questions"
            >
              <span className="menu-icon">☰</span>
            </button>
            <div className="tooltip">View frequently asked questions</div>
          </div>
          
          <button className="close-btn" onClick={handleClose}>
            <span>×</span>
          </button>
        </div>
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

      {showQuickQuestions && (
        <div className="quick-questions-panel">
          <div className="quick-questions-header">
            <h4>Frequently Asked Questions</h4>
          </div>
          <div className="quick-questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="question-chip"
                onClick={() => handleQuickQuestionClick(question)}
              >
                {question}
              </button>
            ))}
          </div>
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