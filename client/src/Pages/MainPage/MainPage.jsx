import React, { useEffect, useState } from 'react';
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';
import "./MainPageStyles.scss"

const MainPage = () => {
  const [games, setGames] = useState(null)

  useEffect(() => {
    setGames(gamesData)
  }, [])
  return (
    <div className='main-page-wrapper'>
      <header>
        <h1>Welcome to Nikola's Casino</h1>
      </header>
      <section className='games-section'>
        <h3>POPULAR GAMES</h3>
        <div className="games-wrapper">
          {gamesData.map((game, index) => (
            <GameThumbnail data={game} key={index + 1}/>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;