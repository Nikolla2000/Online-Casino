import React from 'react';
import ContactItem from './ContactItem';
import { contactData } from './contactData';

const ContactSection = () => {
  return (
    <div className='contact-section-wrapper'>
      <div className="contact-grid">
        {contactData.map((data, i) => (
          <ContactItem data={data} key={i} />
        ))}
      </div>
    </div>
  );
};

export default ContactSection;