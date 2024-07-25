import React from 'react';
import { useForm } from 'react-hook-form';
import "./EmailPageStyles.scss";
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmailPage = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: {errors},
   } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  const randomVideo = () => {
    const videoNumber = Math.floor(Math.random() * 3) + 1;
    return videoNumber;
  }

  return (
    <div className='email-page-wrapper'>
      <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src={`/images/email-page-bg/email-page-bg-${randomVideo()}.mp4`} type="video/mp4" />
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
            <form onSubmit={handleSubmit(onSubmit)} id='contact-form'>
              <div className="first-row">
                <div className="input">
                  <label htmlFor="first-name">First Name</label>
                  <input 
                    type="text"
                    name='firstName'
                    id='first-name'
                    {...register("firstName", { required: true, maxLength: 20 })}/>
                  {errors.firstName && <span>{errors.firstName.message}</span>}
                </div>

              <div className="input">
                <label htmlFor="last-name">Last Name</label>
                  <input 
                    type="text"
                    name='lastName' 
                    id='last-name'
                    {...register("lastName", { required: true, maxLength: 20 })}/>
                  {errors.lastName && <span>{errors.lastName.message}</span>}
              </div>
              </div>

              <div className="second-row">
                <div className="input">
                  <label htmlFor="email">E-mail</label>
                  <input 
                    type="email"
                    name='email' 
                    id='email'
                    {...register("email", { required: true, maxLength: 20 })}/>
                  {errors.email && <span>{errors.email.message}</span>}
                </div>

              <div className="input">
                <label htmlFor="phone">Phone</label>
                  <input 
                    type="number"
                    name='phone' 
                    id='phone'
                    {...register("phone", { required: true })}/>
                  {errors.phone && <span>{errors.phone.message}</span>}
              </div>
              </div>

              <label htmlFor="message" className='msg-label'>Message</label>
              <textarea 
                name="message" 
                id="message" 
                cols="20" 
                rows="8"
                {...register("message", { required: true, maxLength: 150 })}/>

            </form>
            <button form='contact-form'>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;