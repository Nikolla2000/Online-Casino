import React, { useState } from "react";
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AIChatWidget from "../../Components/AIChatSupport/AIChatWidget";
import { useDispatch, useSelector } from "react-redux";
import { showChat } from "../../redux/features/aiChatbot/aiChatbotSlice";

const ContactItem = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  // const [showAIChat, setShowAIChat] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleClick = () => {
    data.heading === "Email" && navigate("/email");
    data.heading === "Live Support" && dispatch(showChat());
  };

  return (
    <div 
      className={`contact-item ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="contact-card">
        <div className="icon-wrapper">
          <div className="icon-circle">
            <FontAwesomeIcon 
              icon={data.icon} 
              className="contact-icon" 
            />
          </div>
        </div>
        
        <div className="content">
          <h3 className="contact-heading">{data.heading}</h3>
          <p className="contact-description">{data.description}</p>
          
          {data.button && (
            <button 
              className={`contact-button ${data.heading === "Email" ? "email-btn" : "chat-btn"}`}
              onClick={handleClick}
            >
              <span className="button-text">
                {data.heading === "Live Support" ? "CHAT NOW" : "EMAIL US"}
              </span>
              <span className="button-arrow">→</span>
            </button>
          )}
        </div>

        <div className="hover-effect"></div>
      </div>
    </div>
  );
};

export default ContactItem;