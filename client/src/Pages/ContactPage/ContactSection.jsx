import React from 'react';
import ContactItem from './ContactItem';
import { contactData } from './contactData';
import { Row, Col } from "react-bootstrap";

const ContactSection = () => {
  return (
    <div className='contact-section-wrapper container'>
      <Row>
        {contactData.map((data, i) => (
          <Col lg={4} md={12}>
            <ContactItem data={data} key={i+1}/>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ContactSection;