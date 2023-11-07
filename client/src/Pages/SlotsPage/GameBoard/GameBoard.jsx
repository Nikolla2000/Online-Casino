import React from 'react';

const GameBoard = ({ randomSlotItem }) => {
  const rows = new Array(3).fill(null);
  const cols = new Array(5).fill(null);



  return (
    <div className='gameboard-wrapper'>
      {rows.map((row, i) => (
        <div key={`row-${i}`} className='row'>
          {cols.map((col, j) => (
            <div key={`col-${j}`} className='image-wrapper col'>
              <img src={`../../../src/assets/images/slot-items/slot_item_0${randomSlotItem()}.jpg`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
