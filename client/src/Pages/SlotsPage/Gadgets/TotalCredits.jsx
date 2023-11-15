import React from 'react';
import { useSelector } from 'react-redux';

const TotalCredits = () => {
  const totalCredits = useSelector(state => state.bets.totalCredits)

  return (
    <div className='total-credits-wrapper bg-black'>
      <p className='text-white uppercase font-bold'>Total credits</p>
      <p className='credits-value'><span className='font-sans'>$</span>{totalCredits}</p>
    </div>
  );
};

export default TotalCredits;