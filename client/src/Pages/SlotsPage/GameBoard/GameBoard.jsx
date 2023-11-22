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

  
const checkSlotWin = (slots) => {

  for (let i = 0; i < slots.length; i++) {
    if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3] &&
      slots[i][3] === slots[i][4]
    ) {
      setIsWin(true)
      dispatch(fiveColsWin())
    } 
    else if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3]
    ) {
      setIsWin(true)
      dispatch(fourColsWin())
    } 
    else if (slots[i][0] === slots[i][1] && slots[i][1] === slots[i][2]) {
      setIsWin(true)
      dispatch(threeColsWin())
    } 
    else if (slots[i][0] === slots[i][1]) {
      setIsWin(true)
      alert("2 cols");
      dispatch(twoColsWin())
      // console.log(totalCredits);
    }
  }

  if(isWin) {
    try {
      axios.put('/user/updateCredits', { userId: user.id, totalCredits})
    } catch (error) {
      console.log(error);
    }
    setIsWin(false)
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
                <img src={`../../../src/assets/images/slot-items/slot_item_${col.toString().padStart(3, '0')}.jpg`} alt={`slot-item-${col}`} />
              </div>
            ))}
          </div>
        ))
        :
        slots.map((row, i) => (
          <div key={`row-${i}`} className='row'>
            {row.map((col, j) => (
              <div key={`col-${j}`} className='image-wrapper col'>
                <img src={`../../../src/assets/images/slot-items/slot_item_${col.toString().padStart(3, '0')}.jpg`} alt={`slot-item-${col}`} />
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
  
};

export default GameBoard;
