import React, { useEffect, useState } from 'react';
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';
import "./MainPageStyles.scss"
import videoBackground from '../../assets/images/background-video.mp4'

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
          <h1>Your Win Awaits</h1>
        </header>
      </div>
      {/* <section className='games-section'>
        <h3>POPULAR GAMES</h3>
        <div className="games-wrapper">
          {gamesData.map((game, index) => (
            <GameThumbnail data={game} key={index + 1}/>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default MainPage;