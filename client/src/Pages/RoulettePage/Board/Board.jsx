import React from 'react';

const Board = () => {
  const generateTable = () => {
    const rows = [];

    for (let i = 1; i <= 36; i += 3) {
      rows.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{i + 1}</td>
          <td>{i + 2}</td>
        </tr>
      );
    }

    return rows;
  };

  return (
    <div className='roulette-board'>
      <div className="roulette-table-wrapper">
        <table>
          <tbody>{generateTable()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Board;
