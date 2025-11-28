import React, { useEffect, useState } from 'react';

const CoinRain = ({ isActive, winAmount }) => {
  const [coins, setCoins] = useState([]);
  const isBigWin = winAmount > 1000;

  useEffect(() => {
    if (isActive && winAmount > 0) {
      const coinCount = Math.min(Math.floor(winAmount / 50), 30);
      const newCoins = [];

      for (let i = 0; i < coinCount; i++) {
        newCoins.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 1,
          rotation: Math.random() * 360,
          size: 40 + Math.random() * 20,
          swingDirection: Math.random() > 0.5 ? 1 : -1
        });
      }

      setCoins(newCoins);

      setTimeout(() => {
        setCoins([]);
      }, 3500);
    }
  }, [isActive, winAmount]);

  if (!isActive || coins.length === 0) return null;

  return (
    <div className={`coin-rain-container ${isBigWin ? 'big-win' : ''}`}>
      {coins.map(coin => (
        <div
          key={coin.id}
          className="coin"
          style={{
            left: `${coin.left}%`,
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
            '--swing-direction': coin.swingDirection,
            '--rotation': `${coin.rotation}deg`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
          }}
        >
          <div className="coin-inner">
            <div className="coin-front">$</div>
            <div className="coin-back">$</div>
          </div>
        </div>
      ))}

      {isBigWin && (
        <div className='big-win-text'>
            BIG WIN!
            <div className="win-amount">${winAmount}</div>
        </div>
      )}
    </div>
  );
};

export default CoinRain;