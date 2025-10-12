import React, { useState } from "react";
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AIChatWidget from "../../Components/AIChatSupport/AIChatWidget";

const ContactItem = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const navigate = useNavigate();

  const sendToEmailPage = () => {
    data.heading === "Email" && navigate("/email");
    data.heading === "Live Support" && setShowAIChat(true);
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
              onClick={sendToEmailPage}
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
      {showAIChat && <AIChatWidget/>}
    </div>
  );
};

export default ContactItem;