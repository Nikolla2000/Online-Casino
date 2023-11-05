import React from 'react';
import './SlotsStyles.scss'
import GameBoard from './GameBoard/GameBoard';
const SlotsPage = () => {
  return (
    <div className='slots-page-wrapper'>
      {/* <div className="slots-game-wrapper">
        <div className="slots-element-wrapper">
            <div className="slot">1</div>
            <div className="slot">2</div>
            <div className="slot">3</div>
        </div>
      </div> */}
      <GameBoard/>
    </div>
  );
};

export default SlotsPage;