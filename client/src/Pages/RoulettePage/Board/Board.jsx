import React from 'react';

const Board = () => {
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const isBlackNumber = (num) => {
    return blackNumbers.includes(num) ? 'black-number' : '';
  };
  

  const generateTable = () => {
    const rows = [];

    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <div key={i} className='board-row'>
          <div className={isBlackNumber(i)}>{i + 2}</div>
          <div className={isBlackNumber(i)}>{i + 1}</div>
          <div className={isBlackNumber(i)}>{i}</div>
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
