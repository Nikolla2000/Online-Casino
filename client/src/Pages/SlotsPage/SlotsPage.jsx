import React from 'react';
import './SlotsStyles.scss'
import GameBoard from './GameBoard/GameBoard';
import SpinButton from './Gadgets/SpinButton';
import GadgetsBar from './Gadgets/GadgetsBar';
const SlotsPage = () => {

  const randomSlotItem = () => {
    const randomSlotItem = Math.floor(Math.random() * 12 + 1);
    if (randomSlotItem < 10) {
      return `0${randomSlotItem}`
    } else {
      return randomSlotItem
    }
  }

  return (
    <div className='slots-page-wrapper'>
      <GameBoard randomSlotItem={randomSlotItem}/>
      <GadgetsBar/>
    </div>
  );
};

export default SlotsPage;