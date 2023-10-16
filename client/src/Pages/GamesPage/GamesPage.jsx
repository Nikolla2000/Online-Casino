import React from 'react';
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';
import "./GamesPageStyles.scss"

const GamesPage = () => {
  return (
    <div className='games-page-wrapper'>
       <section className='games-section'>
        <h2 className='games-page-heading'>TOP GAMES</h2>
        <div className="games-wrapper">
          {gamesData.map((game, index) => (
            <GameThumbnail data={game} key={index + 1}/>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamesPage;