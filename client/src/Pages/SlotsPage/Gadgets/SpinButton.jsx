import React, { useContext, useEffect, useRef } from 'react';
import './GadgetsStyles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { UserContext } from "../../../../context/userContext"
import { startSpinning, stopSpinning, toggleAutoPlay, spendCredits, setSlots, updateCredits, setWinningLines, setIsWinning, setLastWinAmount } from '../../../redux/features/slots/slotMachineSlice';
import axios from '../../../axiosConfig'
import { Switch } from '@mui/material';
import { FormLabel } from 'react-bootstrap';
import { toast } from 'react-hot-toast'
import { slotsAPI } from '../../../services/api/slotsAPI';
import { animateCreditsIncrement, generateRandomSlots } from '../../../utils/slotsUtils';

const SpinButton = () => {
  const dispatch = useDispatch()
  const { isSpinning, autoPlay, slots, totalCredits, bet, soundOn } = useSelector(state => state.slotMachine);
  const { user } = useContext(UserContext);

  const playSound = (soundFile) => {
    if (soundOn) {
      const audio = new Audio(soundFile);
      audio.play();
    }
  };

  const handlePlaySlotsRound = async () => {
    if (isSpinning) return;

    if (totalCredits < bet) {
      const audio = new Audio('/sounds/error-sound.mp3');
      audio.play();
      toast.error('Not Enough Credits');
      return;
    }
    
    dispatch(startSpinning());
    dispatch(updateCredits(totalCredits - bet));
    const spinInterval = setInterval(() => {
      dispatch(setSlots(generateRandomSlots(slots)));
    }, 50) // generating random slot reels every 50 ms - simulating a slots spin

    try {
      const res = await slotsAPI.fetchPlaySlotsRound({
        betAmount: bet
      });
      console.log(res);
      setTimeout(()=> {
        clearInterval(spinInterval);
        dispatch(stopSpinning());
        dispatch(setSlots(res.data.reels));
        dispatch(setWinningLines(res.data.winningLines || []));

        if(res.data.isWin) {
          console.log("WIN");
          dispatch(setIsWinning(true));

          dispatch(setLastWinAmount(res.data.winAmount));

          setTimeout(() => {

            animateCreditsIncrement(
              res.data.balanceBefore - bet, 
              res.data.balanceAfter, 
              dispatch
            );
          }, 1000)

          setTimeout(() => {
            dispatch(setIsWinning(false));
          }, 4000);
        } else {
          dispatch(updateCredits(res.data.balanceAfter));
        }
      }, 2000)

    } catch (err) {
      console.error('Slots game error:', err);
      toast.error(err.response?.data?.message ||'Error on playing game. Please, try again later.');
    } 
    // finally {
    //   dispatch(stopSpinning());
    // }
  }


  // const handleSpin = async () => {
  //   if (isSpinning) {
  //     return;
  //   }
  //   if (totalCredits < betsValue) {
  //     const audio = new Audio('/sounds/error-sound.mp3');
  //     audio.play();
  //     toast.error('Not Enough Credits');
  //     return;
  //   }
  
  //   dispatch(startSpinning());
  
  //   try {
  //     await axios.get('/slots/spin');
  //     dispatch(spendCredits());

  //     await axios.put('/user/updateCredits', { userId: user.id, totalCredits: totalCredits - betsValue })
  //       .then(response => {
  //         // console.log('Update Credits Response:', response);
  //       })
  //       .catch(error => {
  //         console.error('Error updating credits:', error);
  //       });
  //   } catch (error) {
  //     console.error('Error spinning the slots:', error);
  //     dispatch(stopSpinning([]));
  //   }
  // };
  

  const toggle = () => {
    dispatch(toggleAutoPlay())
  }

  const autoSpinIntervalRef = useRef(null)

  //Auto Play Function
  // useEffect(() => {
  //   const startAutoSpin = () => {
  //     autoSpinIntervalRef.current = setInterval(() => {
  //       handleSpin();
  //     }, 3000);
  //   };

  //   const stopAutoSpin = () => {
  //     clearInterval(autoSpinIntervalRef.current);
  //   };

  //   if (autoPlay) {
  //     startAutoSpin();
  //   } else {
  //     stopAutoSpin();
  //   }

  //   return () => {
  //     stopAutoSpin();
  //   };
  // }, [autoPlay, handleSpin]);

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