import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { faLocationDot, faEnvelope, faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./EmailPageStyles.scss";
import api from '../../axiosConfig';

const EmailPage = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      
      const res = await api.post('/v1/email/sendEmail', data);
      
      console.log('Email sent:', res.data);
      setIsSubmitted(true);
      reset();
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Failed to send message. Please try again later.');
    }
  };

  const contactInfo = [
    {
      icon: faPhone,
      label: "Phone",
      value: "+359 947 0320",
      color: "#00b4d8"
    },
    {
      icon: faEnvelope,
      label: "Email",
      value: "nikolla.uzunov@gmail.com",
      color: "#8a2be2"
    },
    {
      icon: faLocationDot,
      label: "Location",
      value: "Varna, Bulgaria",
      color: "#ff6b00"
    }
  ];

  return (
    <div className='email-page-wrapper'>
      <div className="background-pattern"></div>
      
      <div className="email-page-content">
        <div className="header-section">
          <h1 className="main-title">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="subtitle">
            Have questions or want to work together? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="contact-container">
          <div className="contact-card">
            <div className="contact-info-section">
              <div className="info-header">
                <h3>Contact Information</h3>
                <p>Feel free to reach out through any channel</p>
              </div>
              
              <div className="contact-details">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-item">
                    <div 
                      className="icon-wrapper"
                      style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}
                    >
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        style={{ color: item.color }}
                        className="contact-icon"
                      />
                    </div>
                    <div className="contact-content">
                      <span className="contact-label">{item.label}</span>
                      <span className="contact-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="decoration-element">
                <div className="floating-shapes">
                  <div className="shape shape-1"></div>
                  <div className="shape shape-2"></div>
                  <div className="shape shape-3"></div>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName", { 
                        required: "First name is required",
                        maxLength: { value: 20, message: "Maximum 20 characters" }
                      })}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName", { 
                        required: "Last name is required",
                        maxLength: { value: 20, message: "Maximum 20 characters" }
                      })}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    rows="5"
                    {...register("message", { 
                      required: "Message is required",
                      maxLength: { value: 500, message: "Maximum 500 characters" }
                    })}
                    className={errors.message ? 'error' : ''}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <span className="error-message">{errors.message.message}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} />
                      Send Message
                    </>
                  )}
                </button>

                {isSubmitted && (
                  <div className="success-message">
                    ✅ Message sent successfully! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;