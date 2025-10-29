import { useSelector } from "react-redux"
import { TypeAnimation } from "react-type-animation";
import MessageComponent from "./MessageComponent";

const ConversationHistory = () => {
  const { conversationHistory } = useSelector(state => state.aiChatbot);

  if (!conversationHistory.length) {
    return (
      <div className="conversation-wrapper">
        <div className="empty-chat">
          <div className="welcome-message">
            <div className="welcome-avatar">🎰</div>
            <div className="welcome-text">
              <TypeAnimation 
                sequence={["Hello fellow traveler! 👋 I'm your AI casino assistant, ready to help you with games, strategies, and tips!"]}
                speed={70}
                wrapper="span"
                cursor={true}
              />
            </div>
          </div>
          <div className="suggestions">
            <p>Try asking me:</p>
            <div className="suggestion-chips">
              <span>What's the best blackjack strategy?</span>
              <span>Explain poker rules</span>
              <span>Roulette betting tips</span>
            </div>
          </div>
        </div>
      </div>
    )    
  }

  return (
    <div className="conversation-wrapper">
      {conversationHistory.map((message, index) => (
        <div key={message._id || index} className="message-pair">
          {message.userMessage && (
            <MessageComponent 
              message={message.userMessage} 
              type="user" 
              timestamp={message.timeStamp}
            />
          )}
          {message.aiResponse && (
            <MessageComponent 
              message={message.aiResponse} 
              type="ai" 
              timestamp={message.timeStamp}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ConversationHistory;