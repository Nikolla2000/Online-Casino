import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocketChat, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactSection = ({ contactData }) => {
  return (
    <div>
      <div className="icon">
        <FontAwesomeIcon icon={contactData.icon} style={{color: "#fa16fe",}} />
      </div>
      <div className="section-heading"></div>
      <div className="section-descr"></div>
    </div>
  );
};

export default ContactSection;