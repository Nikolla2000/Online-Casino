import React from 'react';
import "./EmailPageStyles.scss";
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmailPage = () => {
  const randomVideo = () => {
    const videoNumber = Math.floor(Math.random() * 4) + 1;
    return videoNumber;
  }

  return (
    <div className='email-page-wrapper'>
      <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src={`../../src/assets/images/email-page-bg/email-page-bg-${randomVideo()}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="email-page-content">
        <h1>Email Us</h1>

        <div className="contact-window">
          <div className="contact-info">
            <h3>Contact Info</h3>
            <div className="infos">
              <div>
                <div className="icon"><FontAwesomeIcon icon={faPhone} /></div>
                <div className="info">+359 947 0320</div>
              </div>
              <div>
                <div className="icon"><FontAwesomeIcon icon={faEnvelope} /></div>
                <div className="info">nikolla.uzunov@gmail.com</div>
              </div>
              <div>
                <div className="icon"><FontAwesomeIcon icon={faLocationDot} /></div>
                <div className="info">Varna, Bulgaria</div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form>
              <label htmlFor="firstName">First Name</label>
              <input 
                type="text"
                name='firstName'
                id='first-name'/>

              <label htmlFor="lastName">Last Name</label>
              <input 
                type="text"
                name='lastName' />

              <label htmlFor="email">E-mail</label>
              <input 
                type="email"
                name='email' />

              <label htmlFor="phone">Phone</label>
              <input 
                type="number"
                name='phone' />
            </form>
            <button>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;