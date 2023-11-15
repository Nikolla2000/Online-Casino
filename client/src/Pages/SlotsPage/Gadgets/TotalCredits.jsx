import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../../../redux/features/slots/betsSlice';
import axios from "../../../axiosConfig";
import { UserContext } from "../../../../context/userContext" 


const TotalCredits = () => {
  const totalCredits = useSelector(state => state.bets.totalCredits)
  const dispatch = useDispatch();
  const { user } = useContext(UserContext)
  
  useEffect(() => {
    const getTotalCredits = async () => {
      const { data } = await axios.get(`/user/getTotalCredits`, user)
      dispatch(updateCredits(data.totalCredits))
    }

    if (user) {
      getTotalCredits();
    }

  }, [user, dispatch])

  return (
    <div className='total-credits-wrapper bg-black'>
      <p className='text-white uppercase font-bold'>Total credits</p>
      <p className='credits-value'><span className='font-sans'>$</span>{totalCredits}</p>
    </div>
  );
};

export default TotalCredits;