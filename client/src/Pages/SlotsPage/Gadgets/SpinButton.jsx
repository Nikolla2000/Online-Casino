import React, { useEffect, useRef } from 'react';
import './GadgetsStyles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { startSpinning, stopSpinning, toggleAutoPlay, setSlots, updateCredits, setWinningLines, setIsWinning, setLastWinAmount } from '../../../redux/features/slots/slotMachineSlice';
import { Switch } from '@mui/material';
import { FormLabel } from 'react-bootstrap';
import { toast } from 'react-hot-toast'
import { animateCreditsIncrement, generateRandomSlots } from '../../../utils/slotsUtils';
import { playSound } from '../../../utils/generalActions';
import { gameAPI } from '../../../services/api/gameAPI.js';
import { useCallback } from 'react';

const SpinButton = () => {
  const dispatch = useDispatch()
  const { isSpinning, autoPlay, slots, totalCredits, bet, soundOn } = useSelector(state => state.slotMachine);

  const handlePlaySlotsRound = useCallback(async () => {
    if (isSpinning) return;

    if (totalCredits < bet) {
      playSound('/sounds/error-sound.mp3', soundOn);
      toast.error('Not Enough Credits');
      return;
    }
    
    dispatch(startSpinning());
    dispatch(updateCredits(totalCredits - bet));

    playSound('/sounds/slots-spin.mp3', soundOn);

    const spinInterval = setInterval(() => {
      dispatch(setSlots(generateRandomSlots(slots)));
    }, 50) // generating random slot reels every 50 ms - simulating a slots spin

    try {
      const res = await gameAPI.fetchPlaySlotsRound({
        betAmount: bet
      });
      
      setTimeout(()=> {
        clearInterval(spinInterval);
        dispatch(setSlots(res.data.reels));
        dispatch(setWinningLines(res.data.winningLines || []));

        if(res.data.isWin) {
          dispatch(setIsWinning(true));

          dispatch(setLastWinAmount(res.data.winAmount));

          if(res.data.winAmount >= 500) {
            playSound('/sounds/jackpot-sound.mp3', soundOn);
          } else {
            playSound('/sounds/slot-win-round2.mp3', soundOn);
          }

          setTimeout(() => {
            playSound('/sounds/slot-win-round.mp3', soundOn);
            
            animateCreditsIncrement(
              res.data.balanceBefore - bet, 
              res.data.balanceAfter, 
              dispatch,
              2000,
              'slots'
              );
            }, 3000)
            
            setTimeout(() => {
            dispatch(stopSpinning());
            dispatch(setIsWinning(false));
          }, 4000);
        } else {
          dispatch(updateCredits(res.data.balanceAfter));
          dispatch(stopSpinning());
        }
      }, 2000)

    } catch (err) {
      console.error('Slots game error:', err);
      toast.error(err.response?.data?.message ||'Error on playing game. Please, try again later.');
      dispatch(stopSpinning());
    }
  }, [isSpinning, totalCredits, bet, slots, soundOn, dispatch]); 
  

  const toggle = () => {
    dispatch(toggleAutoPlay())
  }

  const autoSpinIntervalRef = useRef(null)

  //Auto Play Function
  useEffect(() => {
    const startAutoSpin = () => {
      autoSpinIntervalRef.current = setInterval(() => {
        handlePlaySlotsRound();
      }, 1000);
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
  }, [autoPlay, handlePlaySlotsRound]);

  return (
    <div className='spin-btn'>
      <button onClick={handlePlaySlotsRound} style={{'display' : 'block'}}>
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