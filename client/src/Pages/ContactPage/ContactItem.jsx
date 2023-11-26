import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactItem = ({ data }) => {
  return (
    <div>
      <div className="icon">
        <FontAwesomeIcon icon={data.icon} style={{color: "#fa16fe"}} />
      </div>
      <div className="section-heading">{data.heading}</div>
      <div className="section-descr">{data.description}</div>
    </div>
  );
};

export default ContactItem