import React from 'react';
import './GadgetsStyles.scss'

const Bets = () => {
  return (
    <div className='bets-wrapper flex justify-center align-middle'>
      <div className='minus text-white cursor-pointer'>-</div>
      <div className='bet flex flex-col bg-black'>
        <span className='text-white text-uppercase text-center'>Bet</span>
        <span className='bet-value'>10000</span>
      </div>
      <div className='plus text-white cursor-pointer'>+</div>
    </div>
  );
};

export default Bets;