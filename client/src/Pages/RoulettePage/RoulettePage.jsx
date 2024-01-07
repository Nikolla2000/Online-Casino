import React from 'react';
import Wheel from './Wheel/Wheel';
import Board from './Board/Board';
import "./RouletteStyles.scss";

const RoulettePage = () => {
  return (
    <div className='roulette-page-wrapper'>
      <Wheel/>
      <Board/>
    </div>
  );
};

export default RoulettePage;