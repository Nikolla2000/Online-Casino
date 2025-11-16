import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalCredits, updateCredits } from '../../../redux/features/slots/slotMachineSlice';
import axios from "../../../axiosConfig";

const TotalCredits = () => {
  const totalCredits = useSelector(state => state.slotMachine.totalCredits)
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector(state => state.auth)
  
  useEffect(() => {
    if (user && accessToken) {
      dispatch(fetchTotalCredits());
    };
  }, [user, dispatch]);

  return (
    <div className='total-credits-wrapper bg-black'>
      <p className='text-white uppercase font-bold'>Total credits</p>
      <p className='credits-value'><span className='font-sans'>$</span>{totalCredits}</p>
    </div>
  );
};

export default TotalCredits;