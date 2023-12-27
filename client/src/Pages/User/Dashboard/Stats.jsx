import React, { useEffect, useRef } from 'react';
import { statsData } from './statsData';
import 'animate.css';

const Stats = () => {
  const statsRef = useRef([]);

  useEffect(() => {
    const staggerStats = () => {
      statsRef.current.forEach((stat, i) => {
        setTimeout(() => {
          stat.style.opacity = 1;
          stat.className = 'stat animate__animated animate__bounceInDown'
        }, i * 150);
      });
    };

    staggerStats();
  }, []);

  return (
    <div className='stats-component-wrapper'>
      <h2>Stats</h2>
      <div className='stats'>
        {statsData.map((stat, i) => (
          <div
            className='stat'
            key={i + 1}
            style={{ opacity: 0 }}
            ref={(el) => (statsRef.current[i] = el)}
          >
            <span>{stat.game}</span>
            <span>{stat.hoursPlayed}</span>
            <span>{i !== 0 && '$'} {stat.creditsWon}</span>
            <span>{i !== 0 && '$'} {stat.creditsSpend}</span>
            <span>{stat.winRate}{i !== 0 && '%'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
