import React from 'react';
import './SlotsStyles.scss'
import GameBoard from './GameBoard/GameBoard';
import GadgetsBar from './Gadgets/GadgetsBar';
import CoinRain from './Gadgets/CoinRain';
import { useSelector } from 'react-redux';

const SlotsPage = () => {
  const { isWinning, lastWinAmount } = useSelector(state => state.slotMachine);

  return (
    <div className='slots-page-wrapper'>
      <GameBoard/>
      <GadgetsBar/>

      <CoinRain isActive={isWinning} winAmount={lastWinAmount || 0} />
    </div>
  );
};

export default SlotsPage;