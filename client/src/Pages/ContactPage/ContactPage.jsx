import React from 'react';
import ContactSection from './ContactSection';
import "./ContactStyles.scss";

const ContactPage = () => {
  return (
    <div className='contact-page-wrapper'>
      <div className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="hero-subtitle">
            We're here to help you with any questions or support you need. 
            Reach out to us through any of the channels below.
          </p>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      <ContactSection/>
    </div>
  );
};

export default ContactPage;