import React from 'react';
import './GadgetsStyles.scss'

import { useDispatch, useSelector } from 'react-redux';
import { increaseBet, decreaseBet } from '../../../redux/features/slots/BetsSlice';


const Bets = () => {
  const dispatch = useDispatch()
  const betValue = useSelector(state => state.bets.bet)

  const moreBet = () => {
    dispatch(increaseBet())
  }

  const lessBet = () => {
    dispatch(decreaseBet())
  }

  return (
    <div className='bets-wrapper flex justify-center align-middle'>
      <div className='minus text-white cursor-pointer' onClick={lessBet}>-</div>
      <div className='bet flex flex-col bg-black'>
        <span className='text-white text-uppercase text-center'>Bet</span>
        <span className='bet-value'>{betValue}</span>
      </div>
      <div className='plus text-white cursor-pointer' onClick={moreBet}>+</div>
    </div>
  );
};

export default Bets;