import React from "react";

const ContacItem = ({ contactData }) => {
  return (
    <div>
      <div className="icon">
        <FontAwesomeIcon icon={contactData.icon} style={{color: "#fa16fe",}} />
      </div>
      <div className="section-heading">{contactData.heading}</div>
      <div className="section-descr">{contactData.description}</div>
    </div>
  );
};

export default ContacItem