import React from 'react';

const Bets = () => {
  return (
    <div className='bets-wrapper flex justify-center align-middle'>
      <div className='minus text-white'>-</div>
      <div className='bet flex flex-col'>
        <span className=''>Bet</span>
        <span>10000</span>
      </div>
      <div className='plus text-white'>+</div>
    </div>
  );
};

export default Bets;