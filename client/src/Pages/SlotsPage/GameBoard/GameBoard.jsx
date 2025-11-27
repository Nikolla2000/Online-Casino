import { useSelector } from 'react-redux';

const GameBoard = () => {
  const slots = useSelector(state => state.slotMachine.slots);

  if (!slots) return;

  return (
    <div className='gameboard-wrapper'>
      {slots.map((row, i) => (
        <div key={`row-${i}`} className='row'>
          {row.map((col, j) => (
            <div key={`col-${j}`} className='image-wrapper col'>
              <img src={`/images/slot-items/slot_item_${col.toString().padStart(3, '0')}.jpg`} alt={`slot-item-${col}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  
};

export default GameBoard;
