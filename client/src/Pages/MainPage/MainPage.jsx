import React, { useEffect, useState } from 'react';
import { gamesData } from '../../Components/GameThumbnail/gamesData';
import GameThumbnail from '../../Components/GameThumbnail/GameThumbnail';

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
        {gamesData.map((game, index) => (
          <GameThumbnail data={game} key={index + 1}/>
        ))}
      </section>
    </div>
  );
};

export default MainPage;