import React, { useState, useEffect } from 'react';
import videoBackground from '../../../../assets/images/background-video4.mp4'
import { Link } from 'react-router-dom';
import "animate.css"

const HeaderSection = () => {
  const [headerClass, setHeaderClass] = useState('hidden');
  const [buttonClass, setButtonClass] = useState('hidden');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHeaderClass('animate__animated animate__fadeIn');
    }, 1000);

    const timeout2Id = setTimeout(() => {
      setButtonClass('animate__animated animate__fadeIn');
    }, 2000);

    return () => clearTimeout(timeoutId, timeout2Id);
  }, []);

  return (
    <div className="header-section">
      <video autoPlay loop muted className="video-background">
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header className={headerClass}>
        <h1>Your Winnings Await</h1>
        <div className={`start-playing-btn ${buttonClass}`}>
          <Link to='/games' className="glowButton" href="#">Start Playing</Link>
        </div>
      </header>
    </div>
  );
};

export default HeaderSection;
