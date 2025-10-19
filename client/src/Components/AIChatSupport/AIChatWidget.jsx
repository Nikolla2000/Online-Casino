import { useState } from "react"
import "./AIChatStyles.scss";
import { promptChatBot } from "../../services/api/chatBotAPI";
import { useSelector } from "react-redux";

const AIChatWidget = () => {
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      message: e.target.value
    })
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
      console.error('Message submission failed:', error);
    } finally {
      setFormData({ message: '' });
    }
  }

  return (
    <div className="ai-chat-wrapper">
      <form id="ai-support-form" onSubmit={handleSubmit}>
        <input type="text" name="message" id="message" value={formData.message} onChange={handleChange} required/>
        <button type="submit">Enter</button>
      </form>
    </div>
  )
}

export default AIChatWidget;