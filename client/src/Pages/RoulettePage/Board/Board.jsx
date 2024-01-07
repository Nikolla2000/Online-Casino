import React from 'react';

const Board = () => {
  const generateTable = () => {
    const rows = [];

    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <div key={i} className='rowche'>
          <div>{i + 2}</div>
          <div>{i + 1}</div>
          <div>{i}</div>
        </div>
      );
    }

    return rows;
  };
  const generateTable2 = () => {
    const rows = [];

    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <tr key={i}>
          <td>{i + 2}</td>
          <td>{i + 1}</td>
          <td>{i}</td>
        </tr>
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
