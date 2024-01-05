import React from 'react';
import Wheel from './Wheel/Wheel';
import Board from './Board/Board';

const RoulettePage = () => {
  return (
    <div className='roulette-page-wrapper'>
      <Wheel/>
      <Board/>
    </div>
  );
};

export default RoulettePage;