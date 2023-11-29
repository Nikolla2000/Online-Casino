import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactItem = ({ data }) => {
  return (
    <div>
      <div className="icon">
        <FontAwesomeIcon icon={data.icon} style={{color: "#fa16fe"}} />
      </div>
      <div className="section-heading">
        <h3>{data.heading}</h3>
      </div>
      <div className="section-descr">
        <p>{data.description}</p>
      </div>
      {data.button == true ? (
        <div className="open-chat-btn">
          <button>Chat now</button>
        </div>
      ) : ''}
    </div>
  );
};

export default ContactItem