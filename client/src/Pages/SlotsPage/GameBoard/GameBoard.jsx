import React from 'react';
import { useSelector } from 'react-redux';

const GameBoard = () => {
  const slots = useSelector(state => state.slotMachine.slots)
  const rows = new Array(3).fill(null);
  const cols = new Array(5).fill(null);
  console.log(slots);

  return (
    <div className='gameboard-wrapper'>
      {rows.map((row, i) => (
        <div key={`row-${i}`} className='row'>
          {cols.map((col, j) => (
            <div key={`col-${j}`} className='image-wrapper col'>
              <img src={`../../../src/assets/images/slot-items/slot_item_${slots[i][j].toString().padStart(3, '0')}.jpg`} alt={`slot-item-${slots[i][j]}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
