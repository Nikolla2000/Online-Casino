import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const GameBoard = () => {
  const slots = useSelector(state => state.slotMachine.slots);
  const winningLines = useSelector(state => state.slotMachine.winningLines);
  const [highlightedCells, setHighlightedCells] = useState(new Set());

  // Map pattern names to cell positions
  const getPositionsFromPattern = (patternName) => {
    const patterns = {
      'Top Row': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
      'Middle Row': [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
      'Bottom Row': [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
      'Diagonal Down': [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]],
      'Diagonal Up': [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]],
      'V Pattern': [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]],
      'Inverted V': [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]],
      'Zigzag 1': [[1, 0], [0, 1], [1, 2], [2, 3], [1, 4]],
      'Zigzag 2': [[1, 0], [2, 1], [1, 2], [0, 3], [1, 4]]
    };

    return patterns[patternName] || [];
  };

  useEffect(() => {
    if (winningLines && winningLines.length > 0) {
      const cellsToHighlight = new Set();
      
      winningLines.forEach(line => {
        const positions = getPositionsFromPattern(line.pattern);
        
        // Get how many symbols matched (based on multiplier logic)
        const matchCount = getMatchCountFromLine(line.symbols);
        
        // Highlight only the matching symbols
        positions.slice(0, matchCount).forEach(([row, col]) => {
          cellsToHighlight.add(`${row}-${col}`);
        });
      });

      setHighlightedCells(cellsToHighlight);

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedCells(new Set());
      }, 3000);
    } else {
      setHighlightedCells(new Set());
    }
  }, [winningLines]);

  // Determine how many consecutive symbols matched
  const getMatchCountFromLine = (symbols) => {
    if (!symbols || symbols.length === 0) return 0;
    
    const firstSymbol = symbols[0];
    let count = 1;
    
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  };

  if (!slots) return null;

  return (
    <div className='gameboard-wrapper'>
      {slots.map((row, i) => (
        <div key={`row-${i}`} className='row'>
          {row.map((col, j) => {
            const cellKey = `${i}-${j}`;
            const isWinning = highlightedCells.has(cellKey);
            
            return (
              <div 
                key={`col-${j}`} 
                className={`image-wrapper col ${isWinning ? 'winning-cell' : ''}`}
              >
                <img 
                  src={`/images/slot-items/slot_item_${col.toString().padStart(3, '0')}.jpg`} 
                  alt={`slot-item-${col}`} 
                />
                {isWinning && <div className="win-overlay"></div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;