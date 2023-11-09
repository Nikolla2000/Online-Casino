import React from 'react';
import './GadgetsStyles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { startSpinning, stopSpinning } from '../../../redux/features/slots/slotMachineSlice';
import axios from '../../../axiosConfig'

const SpinButton = () => {
  const dispatch = useDispatch()
  const isSpinning = useSelector(state => state.slotMachine.isSpinning)
  const slots = useSelector(state => state.slotMachine.slots)

  const handleSpin = async () => {
    dispatch(startSpinning());

    try {
      const response = await axios.get('/slots/spin');
      dispatch(stopSpinning(response.data.result));
    } catch (error) {

      console.error('Error spinning the slots:', error);
      dispatch(stopSpinning([]));
    }
  };

  return (
    <div className='spin-btn'>
      <button onClick={handleSpin}>
        Spin
      </button>
    </div>
  );
};

export default SpinButton;