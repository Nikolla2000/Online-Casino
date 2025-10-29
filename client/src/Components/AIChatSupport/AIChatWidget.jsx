import { useEffect, useState } from "react"
import "./AIChatStyles.scss";
import { fetchConversationHistory, promptChatBot } from "../../services/api/chatBotAPI";
import { useDispatch, useSelector } from "react-redux";
import { hideChat, setConversationHistory } from "../../redux/features/aiChatbot/aiChatbotSlice";

const AIChatWidget = () => {
  const { user, accessToken } = useSelector(state => state.auth);
  const { conversationHistory } = useSelector(state => state.aiChatbot);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    message: '',
  });

  useEffect(() => {
    const getConversationHistory = async () => {
      const data = await fetchConversationHistory();
      dispatch(setConversationHistory(data));
    }

    if(user && accessToken) {
      getConversationHistory();
      console.log(conversationHistory);
    }
  }, [user, accessToken]);

  const handleChange = (e) => {
    setFormData({
      message: e.target.value
    })
  }

  const handleClose = () => {
    dispatch(hideChat());
  }

  //Message submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = user?._id || null;

    try {
      const res = await promptChatBot({
        message: formData.message,
        userId: userId,
      });
    } catch (err) {
      console.error('Message submission failed:', err);
    } finally {
      setFormData({ message: '' });
    }
  }

  return (
    <div className="ai-chat-wrapper">
      <button onClick={handleClose}>X</button>
      <form id="ai-support-form" onSubmit={handleSubmit}>
        <input type="text" name="message" id="message" value={formData.message} onChange={handleChange} required/>
        <button type="submit">Enter</button>
      </form>
    </div>
  )
}

export default AIChatWidget;