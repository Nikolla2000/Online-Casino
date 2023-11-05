import React from 'react';

const GameBoard = () => {
  const rows = new Array(3).fill(null);
  const cols = new Array(5).fill(null);

  const randomSlotItem = () => {
    const randomSlotItem = Math.floor(Math.random() * 12 + 1);
    if (randomSlotItem < 10) {
      return `0${randomSlotItem}`
    } else {
      return randomSlotItem
    }
  }

  return (
    <div className='gameboard-wrapper'>
      {rows.map((row, i) => (
        <div key={`row-${i}`} className='row'>
          {cols.map((col, j) => (
            <div key={`col-${j}`} className='col'>
              <img src={`../../../src/assets/images/slot-items/slot_item_0${randomSlotItem()}.jpg`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
