import React from 'react';
import { Button } from 'react-bootstrap';

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
          <div className={isBlackNumber(i + 2)}>{i + 2}</div>
          <div className={isBlackNumber(i + 1)}>{i + 1}</div>
          <div className={isBlackNumber(i)}>{i}</div>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className='board-and-gadgets-wrapper'>

      <div className='board'>
        <div className="board-top-side">
          <div className='zero'><span>0</span></div>
          {generateTable()}
          <div className='two-one'>
            <div>2:1</div>
            <div>2:1</div>
            <div>2:1</div>
          </div>
        </div>
        
        <div className="board-bottom-side">
          <div className='bet-options'>
            <div className='option'>
              <div>1<sup>st</sup> 12</div>
              <div className='left-border'>1 to 18</div>
              <div>EVEN</div>
            </div>
            <div className='option'>
              <div>2<sup>nd</sup> 12</div>
              <div className='red'>black</div>
              <div className='black'>black</div>
            </div>
            <div className='option'>
              <div>3<sup>rd</sup> 12</div>
              <div>ODD</div>
              <div className='right-border'>19 to 36</div>
            </div>
          </div>
        </div>
      </div>

      <div className="gadgets">
        <div className="place-bet-loader">
          <h4>PLACE BET</h4>
          LOADER
        </div>
        <div className="bet-amount-buttons">
          <button className='clear-bet-btn'>Clear Bet</button>
          <img src='' alt='5 chip' />
          <img src='' alt='10 chip' />
          <img src='' alt='20 chip' />
          <img src='' alt='100 chip' />
          <button className='place-bet-btn'>Place Bet</button>
        </div>
      </div>
    </div>
  );
};

export default Board;
