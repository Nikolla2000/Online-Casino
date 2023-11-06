import React from 'react';
import './GadgetsStyles.scss'

const Bets = () => {
  return (
    <div className='bets-wrapper flex justify-center align-middle'>
      <div className='minus'>-</div>
      <div className='bet flex flex-col'>
        <span className=''>Bet</span>
        <span className='bet-value'>10000</span>
      </div>
      <div className='plus'>+</div>
    </div>
  );
};

export default Bets;