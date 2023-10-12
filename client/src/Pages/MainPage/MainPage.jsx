import React, { useEffect, useState } from 'react';
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';
import "./MainPageStyles.scss"
import videoBackground from '../../assets/images/background-video2.mp4'
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [games, setGames] = useState(null)

  useEffect(() => {
    setGames(gamesData)
  }, [])
  return (
    <div className='main-page-wrapper'>
      <video autoPlay loop muted className="video-background">
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <header>
          <h1>Your Winnings Await</h1>
          <div className="start-playing-btn">
            <Link to='/games' class="glowButton" href="#">Start Playing</Link>
          </div>
        </header>
      </div>
    </div>
  );
};

export default MainPage;