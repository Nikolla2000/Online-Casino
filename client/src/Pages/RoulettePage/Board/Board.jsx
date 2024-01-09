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
          <div className='zero'>0</div>
          {generateTable()}
          <div className='two-one'>
            <div>2:1</div>
            <div>2:1</div>
            <div>2:1</div>
          </div>
          <div className='bet-options'>
            <div className='option'>
              <div>1<sup>st</sup> 12</div>
              <div>1 to 18</div>
              <div>EVEN</div>
            </div>
            <div className='option'>
              <div>2<sup>nd</sup> 12</div>
              <div>red</div>
              <div>black</div>
            </div>
            <div className='option'>
              <div>3<sup>rd</sup> 12</div>
              <div>ODD</div>
              <div>19 to 36</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
