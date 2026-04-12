import React, { useState, useEffect } from 'react';
import "./GamesPageStyles.scss";
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';
import LoadingSpinner from '../../Components/Spinner/Spinner';

const GamesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleGames, setVisibleGames] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const animateGames = async () => {
        for (let i = 0; i < gamesData.length; i++) {
          setVisibleGames(prev => [...prev, gamesData[i]]);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      };
      animateGames();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='games-page-wrapper'>
      <div className="background-overlay"></div>
      
      <section className='games-section'>
        <div className="header-content">
          <h2 className='games-page-heading'>
            <span className="gradient-text">PREMIUM</span>
            <span className="glowing-text">GAMES</span>
          </h2>
          <p className="section-subtitle">
            Experience our collection of thrilling casino games with 
            stunning visuals and immersive gameplay
          </p>
        </div>

        {!isLoading ? (
          <LoadingSpinner /> 
        ) : (
          <div className="games-grid">
            {visibleGames.map((game, index) => (
              <GameThumbnail 
                data={game} 
                key={game.id || index} 
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GamesPage;