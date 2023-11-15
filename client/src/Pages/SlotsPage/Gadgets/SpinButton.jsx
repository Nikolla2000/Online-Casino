import React, { useEffect, useRef } from 'react';
import './GadgetsStyles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { startSpinning, stopSpinning, toggleAutoPlay } from '../../../redux/features/slots/slotMachineSlice';
import axios from '../../../axiosConfig'
import { Switch } from '@mui/material';
import { FormLabel } from 'react-bootstrap';
import { toast } from 'react-hot-toast'
import { spendCredits } from '../../../redux/features/slots/betsSlice';

const SpinButton = () => {
  const dispatch = useDispatch()
  const isSpinning = useSelector(state => state.slotMachine.isSpinning)
  const autoPlay = useSelector(state => state.slotMachine.autoPlay)
  const slots = useSelector(state => state.slotMachine.slots)
  const betsValue = useSelector(state => state.bets.bet)
  const totalCredits = useSelector(state => state.bets.totalCredits)
  console.log(isSpinning, slots);

  const handleSpin = async () => {
    if(isSpinning) {
      return
    }
    if(totalCredits < betsValue){
      const audio = new Audio('../../../src/assets/sounds/error-sound.mp3');
      audio.play();
      toast.error('Not Enough Credits')
      return
    }

    dispatch(startSpinning());

    try {
      await axios.get('/slots/spin');
      dispatch(spendCredits())
      await axios.put('/user/updateCredits', totalCredits)
    } catch (error) {

      console.error('Error spinning the slots:', error);
      dispatch(stopSpinning([]));
    }
  };

  const toggle = () => {
    dispatch(toggleAutoPlay())
  }

  const autoSpinIntervalRef = useRef(null)

  //Auto Play Function
  useEffect(() => {
    const startAutoSpin = () => {
      autoSpinIntervalRef.current = setInterval(() => {
        handleSpin();
      }, 3000);
    };

    const stopAutoSpin = () => {
      clearInterval(autoSpinIntervalRef.current);
    };

    if (autoPlay) {
      startAutoSpin();
    } else {
      stopAutoSpin();
    }

    return () => {
      stopAutoSpin();
    };
  }, [autoPlay, handleSpin]);

  return (
    <div className='spin-btn'>
      <button onClick={handleSpin} style={{'display' : 'block'}}>
        Spin
      </button>
      <div className="text-center">
        <FormLabel label='sese'>
          <Switch label='AutoStart' onChange={toggle}/>
          <span className='text-teal-400 font-bold text-uppercase'>Auto Play</span>
        </FormLabel>
      </div>
    </div>
  );
};

export default SpinButton;