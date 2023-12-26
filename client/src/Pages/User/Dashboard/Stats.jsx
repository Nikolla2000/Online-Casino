import React from 'react';
import { statsData } from './statsData';

const Stats = () => {
  return (
    <div className='stats-component-wrapper'>
      <h2>Stats</h2>
      <div className="stats" >
        {statsData.map((stat, i) => (
          <div className="stat" key={i + 1}>
            <span>{stat.game}</span>
            <span>{stat.hoursPlayed}</span>
            <span>{stat.creditsWon}</span>
            <span>{stat.creditsSpend}</span>
            <span>{stat.winRate}</span>
          </div>
        ))}
        </div>
    </div>
  );
};

export default Stats;