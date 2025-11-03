import { useDispatch, useSelector } from "react-redux"
import { TypeAnimation } from "react-type-animation";
import MessageComponent from "./MessageComponent";
import { addMessage, setConversationHistory, startChatbotTyping, stopChatbotTyping } from "../../redux/features/aiChatbot/aiChatbotSlice";
import { promptChatBot } from "../../services/api/chatBotAPI";

const ConversationHistory = () => {
  const { conversationHistory } = useSelector(state => state.aiChatbot);
  const { user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const handleSubmitSuggestion = async (e) => {
    const userId = user?._id || null;
    const userMessage = e.target.innerText;

    const tempUserMessage = {
        _id: Date.now().toString(),
        userMessage: userMessage,
        aiResponse: "",
        timeStamp: new Date().toISOString(),
        isTemp: true
    };

    dispatch(addMessage(tempUserMessage));

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

        console.log(conversationHistory);

    } catch (err) {
        console.err('Suggestion message completion failed: err');
        dispatch(setConversationHistory(conversationHistory.filter(msg => !msg.isTemp)));
    } finally {
        dispatch(stopChatbotTyping());
    }
  }

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
              <span onClick={handleSubmitSuggestion}>What's the best blackjack strategy?</span>
              <span onClick={handleSubmitSuggestion}>Explain poker rules</span>
              <span onClick={handleSubmitSuggestion}>Roulette betting tips</span>
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