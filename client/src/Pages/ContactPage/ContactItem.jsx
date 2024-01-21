import React from "react";
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactItem = ({ data }) => {
  const navigate = useNavigate()

  const sendToEmailPage = () => {
    data.heading === "Email" && navigate("/email");
  }

  return (
    <div className="contact-item">
      <div className="icon mb-3">
        <FontAwesomeIcon icon={data.icon} style={{color: "#fa16fe"}} />
      </div>
      <div className="section-heading">
        <h3>{data.heading}</h3>
      </div>
      <div className="section-descr">
        <p>{data.description}</p>
      </div>
      {data.button == true ? (
        <div className={`open-chat-btn mt-4 ${data.heading === "Email" && "blue"}`}>
          <button onClick={sendToEmailPage}>
            {data.heading === "Live Support" ? "CHAT NOW" : "EMAIL US"}
            </button>
        </div>
      ) : ''}
    </div>
  );
};

export default ContactItem