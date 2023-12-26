import React from 'react';
import { statsData } from './statsData';
import "animate.css";

const Stats = () => {
  return (
    <div className='stats-component-wrapper'>
      <h2>Stats</h2>
      <div className="stats" >
        {statsData.map((stat, i) => (
          <div className="stat animate__animated animate__bounceInDown" key={i + 1}>
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