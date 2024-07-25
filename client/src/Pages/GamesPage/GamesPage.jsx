import React, { useEffect, useState } from 'react';
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';
import backgroundVideo from "/images/games-page-background.mp4"
import "./GamesPageStyles.scss"
import LoadingSpinner from '../../Components/Spinner/Spinner';

const GamesPage = () => {
  const [gameOneAnimation, setGameOneAnimation] = useState('animate__animated animate__fadeInRight');
  const [gameTwoAnimation, setGameTwoAnimation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoitId = setTimeout(() => {
      setGameTwoAnimation('animate__animated animate__fadeInRight')
    }, 400)
    
    setIsLoading(false);
    return () => clearTimeout(timeoitId);
  }, [])

  return (
    <div className='games-page-wrapper'>
      <video src={backgroundVideo}></video>
      <section className='games-section'>
        <h2 className='games-page-heading'>TOP <span>GAMES</span></h2>
        {isLoading ? (
          <LoadingSpinner/> 
        ) : (
          <div className="games-wrapper">
            {gamesData.map((game, index) => (
              <GameThumbnail data={game} key={index + 1} firstAnimation={gameOneAnimation} secondAnimation={gameTwoAnimation} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GamesPage;