import React from 'react';
import videoBackground from '../../../../assets/images/background-video2.mp4'
import { Link } from 'react-router-dom';
import "animate.css"


const HeaderSection = () => {
  return (
      <div className="header-section">
        <video autoPlay loop muted className="video-background">
          <source src={videoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <header className="animate__animated animate__fadeIn">
          <h1>Your Winnings Await</h1>
          <div className="start-playing-btn">
            <Link to='/games' className="glowButton" href="#">Start Playing</Link>
          </div>
        </header>
      </div>
  );
};

export default HeaderSection;