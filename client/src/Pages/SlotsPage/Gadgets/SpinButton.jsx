import React from 'react';
import './GadgetsStyles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { startSpinning, stopSpinning } from '../../../redux/features/slots/slotMachineSlice';

const SpinButton = ({ randomSlotItem }) => {
  const dispatch = useDispatch()
  const isSpinning = useSelector(state => state.slotMachine.isSpinning)

  const handleSpin = () => {
    dispatch(startSpinning())

    setTimeout(() => {
      const finalCombination = getFinalCombinationFromServer();
      dispatch(stopSpinning(finalCombination));
    }, 3000);
  }
  return (
    <div className='spin-btn'>
      <button onClick={handleSpin}>
        Spin
      </button>
    </div>
  );
};

export default SpinButton;