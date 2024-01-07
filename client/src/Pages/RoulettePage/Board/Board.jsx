import React from 'react';

const Board = () => {
  const generateTable = () => {
    const rows = [];

    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <div key={i} className='board-row'>
          <div>{i + 2}</div>
          <div>{i + 1}</div>
          <div>{i}</div>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className='roulette-board'>
      <div className="table-board-wrapper">
        <div className='board'>
          {generateTable()}
        </div>
      </div>
    </div>
  );
};

export default Board;
