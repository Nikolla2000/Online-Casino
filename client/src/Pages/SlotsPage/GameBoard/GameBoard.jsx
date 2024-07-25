import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fiveColsWin, fourColsWin, startSpinning, stopSpinning, threeColsWin, twoColsWin } from '../../../redux/features/slots/slotMachineSlice';
import { UserContext } from '../../../../context/userContext'
import axios from '../../../axiosConfig';

const GameBoard = () => {
  const dispatch = useDispatch();
  const isSpinning = useSelector(state => state.slotMachine.isSpinning);
  const totalCredits = useSelector(state => state.slotMachine.totalCredits)
  const slots = useSelector(state => state.slotMachine.slots);
  const [spinningSlots, setSpinningSlots] = useState(slots);
  const [isWin, setIsWin] = useState(false)
  const { user } = useContext(UserContext)
  
  const checkSlotWin = async (slots) => {
  const audio = new Audio('/sounds/slot-win-sound.mp3');
  setIsWin(false)

    for (let i = 0; i < slots.length; i++) {
      if (
        slots[i][0] === slots[i][1] &&
        slots[i][1] === slots[i][2] &&
        slots[i][2] === slots[i][3] &&
        slots[i][3] === slots[i][4]
        ) {
          setIsWin(true)
          dispatch(fiveColsWin())
          audio.play();
        } 
        else if (
          slots[i][0] === slots[i][1] &&
          slots[i][1] === slots[i][2] &&
          slots[i][2] === slots[i][3]
          ) {
        setIsWin(true)
        dispatch(fourColsWin())
        audio.play();
        } 
        else if (slots[i][0] === slots[i][1] && slots[i][1] === slots[i][2]) {
          setIsWin(true)
          dispatch(threeColsWin())
          audio.play();
        } 
        else if (slots[i][0] === slots[i][1]) {
          setIsWin(true)
          dispatch(twoColsWin())
          audio.play();
        }
      }
    
    if(isWin === true) {
      setIsWin(false)
      try {
        await axios.put('/user/updateCredits', { userId: user.id, totalCredits})
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isSpinning) {
      const spinInterval = setInterval(() => {
        setSpinningSlots(generateRandomSlots());
      }, 50);

      setTimeout(() => {
        clearInterval(spinInterval);
        const finalSlots = generateFinalSlots()
        dispatch(stopSpinning(finalSlots));
        checkSlotWin(finalSlots)
      }, 2000);

      return () => {
        clearInterval(spinInterval);
      };
    }
  }, [isSpinning, dispatch]);

  const generateRandomSlots = () => {
    return slots.map(row => row.map(() => Math.floor(Math.random() * 12 + 1)));
  };

  const generateFinalSlots = () => {
    return slots.map(row => row.map(() => Math.floor(Math.random() * 12 + 1)));
  };

  return (
    <div className='gameboard-wrapper'>
      {isSpinning ?
        spinningSlots.map((row, i) => (
          <div key={`row-${i}`} className='row'>
            {row.map((col, j) => (
              <div key={`col-${j}`} className='image-wrapper col'>
                <img src={`/images/slot-items/slot_item_${col.toString().padStart(3, '0')}.jpg`} alt={`slot-item-${col}`} />
              </div>
            ))}
          </div>
        ))
        :
        slots.map((row, i) => (
          <div key={`row-${i}`} className='row'>
            {row.map((col, j) => (
              <div key={`col-${j}`} className='image-wrapper col'>
                <img src={`/images/slot-items/slot_item_${col.toString().padStart(3, '0')}.jpg`} alt={`slot-item-${col}`} />
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
  
};

export default GameBoard;
