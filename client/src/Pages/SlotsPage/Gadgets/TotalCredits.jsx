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
      if (user && user.id) {
        try {
          const { data } = await axios.get('/user/getTotalCredits', { params: { id: user.id } });
          dispatch(updateCredits(data.totalCredits));
        } catch (error) {
          console.error('Error fetching total credits:', error);
        }
      }
    };

    getTotalCredits();
  }, [user, dispatch]);

  return (
    <div className='total-credits-wrapper bg-black'>
      <p className='text-white uppercase font-bold'>Total credits</p>
      <p className='credits-value'><span className='font-sans'>$</span>{totalCredits}</p>
    </div>
  );
};

export default TotalCredits;