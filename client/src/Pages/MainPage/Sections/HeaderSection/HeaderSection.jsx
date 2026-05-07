import React, { useState, useEffect, useRef } from 'react';
import videoBackground from '/images/background-video4.mp4';
import { Link, useNavigate } from 'react-router-dom';
import ButtonLink from '../../../../Components/Buttons/ButtonLink/ButtonLink';
import { useDispatch } from 'react-redux';
import { showLogin } from '../../../../redux/features/auth/authModalsSlice';

const HeaderSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsVisible(true);
    
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85;
    }
  }, []);

  return (
    <div className="header-section">
      <div className="video-overlay"></div>
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        className="video-background"
        playsInline
        preload="auto"
      >
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="particles-container">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className={`header-content ${isVisible ? 'visible' : ''}`}>
        <div className="main-heading">
          <span className="gradient-text">YOUR</span>
          <span className="glowing-text">WINNINGS</span>
          <span className="gradient-text">AWAIT</span>
        </div>
        
        <p className="subtitle">
          Experience the thrill of premium casino games with stunning graphics 
          and immersive gameplay. Join thousands of winners today!
        </p>

        <div className="cta-buttons">
          <ButtonLink variant='primary' onClick={() => dispatch(showLogin())}>
            Sign in
          </ButtonLink>
          
          <ButtonLink variant='secondary' onClick={() => navigate('/about')}>
            Learn more
          </ButtonLink>

          <ButtonLink variant='primary' onClick={() => navigate('/games')}>
            View Games
          </ButtonLink>
        </div>

        <div className="stats-container">
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Players Online</span>
          </div>
          <div className="stat">
            <span className="stat-number">100+</span>
            <span className="stat-label">Games</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
};

export default HeaderSection;