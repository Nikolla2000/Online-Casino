import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startSpinning, stopSpinning, twoColsWin } from '../../../redux/features/slots/slotMachineSlice';

const GameBoard = () => {
  const dispatch = useDispatch();
  const isSpinning = useSelector(state => state.slotMachine.isSpinning);
  const slots = useSelector(state => state.slotMachine.slots);
  const [spinningSlots, setSpinningSlots] = useState(slots);

  
const checkSlotWin = (slots) => {

  for (let i = 0; i < slots.length; i++) {
    if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3] &&
      slots[i][3] === slots[i][4]
    ) {
      alert("5 cols");
    } 
    else if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3]
    ) {
      alert("4 cols");
    } 
    else if (slots[i][0] === slots[i][1] && slots[i][1] === slots[i][2]) {
      alert("3 cols");
    } 
    else if (slots[i][0] === slots[i][1]) {
      alert("2 cols");
      dispatch(twoColsWin())
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
