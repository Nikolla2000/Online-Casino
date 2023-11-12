import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startSpinning, stopSpinning } from '../../../redux/features/slots/slotMachineSlice';

const GameBoard = () => {
  const dispatch = useDispatch();
  const isSpinning = useSelector(state => state.slotMachine.isSpinning);
  const slots = useSelector(state => state.slotMachine.slots);
  const [spinningSlots, setSpinningSlots] = useState(slots);

  useEffect(() => {
    if (isSpinning) {
      // Simulate spinning by updating the slot items with a delay
      const spinInterval = setInterval(() => {
        setSpinningSlots(generateRandomSlots());
      }, 50);

      // Stop spinning after a certain duration
      setTimeout(() => {
        clearInterval(spinInterval);
        dispatch(stopSpinning(generateFinalSlots()));
      }, 3000); // Adjust the duration as needed

      return () => {
        clearInterval(spinInterval);
      };
    }
  }, [isSpinning, dispatch]);

  const generateRandomSlots = () => {
    // Replace this with your logic to generate random slot items for each slot position
    return slots.map(row => row.map(() => Math.floor(Math.random() * 12 + 1)));
  };

  const generateFinalSlots = () => {
    // Replace this with your logic to generate the final slot items
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
