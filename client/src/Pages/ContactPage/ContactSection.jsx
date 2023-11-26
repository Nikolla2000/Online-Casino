import React from 'react';
import ContactItem from './ContactItem';
import { contactData } from './contactData';

const ContactSection = () => {
  return (
    <div className='contact-section-wrapper'>
      {contactData.map((data, i) => (
        <ContactItem data={data} key={i+1}/>
      ))}
    </div>
  );
};

export default ContactSection;