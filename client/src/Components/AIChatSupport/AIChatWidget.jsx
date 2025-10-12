import { useState } from "react"
import "./AIChatStyles.scss";
import { promptChatBot } from "../../services/api/chatBotAPI";

const AIChatWidget = () => {
  const [formData, setFormData] = useState({
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      message: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      message: ''
    });

    promptChatBot(formData);
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