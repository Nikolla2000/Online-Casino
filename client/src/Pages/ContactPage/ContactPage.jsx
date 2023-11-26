import React from 'react';
import PageHeaderComponent from '../../Components/PageHeader/PageHeader';
import ContactSection from './ContactSection';

const ContactPage = () => {
  return (
    <div>
      <PageHeaderComponent heading={{title: "Contact", breadcrumb: "Contact"}}/>
      <ContactSection/>
    </div>
  );
};

export default ContactPage;