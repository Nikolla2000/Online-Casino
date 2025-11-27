import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalCredits } from '../../../redux/features/slots/slotMachineSlice';

const TotalCredits = () => {
  const { totalCredits, isWinning } = useSelector(state => state.slotMachine);
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (user && accessToken) {
      dispatch(fetchTotalCredits());
    }
  }, [user, dispatch]);

  return (
    <div className='total-credits-wrapper bg-black'>
      <p className='text-white uppercase font-bold'>Total credits</p>
      <p className={`credits-value ${isWinning ? 'winning' : ''}`}>
        <span className='font-sans'>$</span>{totalCredits}
      </p>
    </div>
  );
};

export default TotalCredits;