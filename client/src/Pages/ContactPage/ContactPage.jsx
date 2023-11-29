import React from 'react';
import PageHeaderComponent from '../../Components/PageHeader/PageHeader';
import ContactSection from './ContactSection';
import "./ContactStyles.scss";

const ContactPage = () => {
  return (
    <div className='contact-page-wrapper'>
      <PageHeaderComponent heading={{title: "Contact", breadcrumb: "Contact"}}/>
      <ContactSection/>
    </div>
  );
};

export default ContactPage;