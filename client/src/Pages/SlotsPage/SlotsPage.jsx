import React from 'react';
import './SlotsStyles.scss'
import GameBoard from './GameBoard/GameBoard';
import GadgetsBar from './Gadgets/GadgetsBar';

const SlotsPage = () => {
  
  return (
    <div className='slots-page-wrapper'>
      <GameBoard/>
      <GadgetsBar/>
    </div>
  );
};

export default SlotsPage;