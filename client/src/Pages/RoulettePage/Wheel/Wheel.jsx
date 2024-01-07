import React from 'react';

const Wheel = () => {
  return (
    <div className='roulette-wheel'>
      <div className="roulette-img-wrapper">
        <img src='../../src/assets/images/roulette/roulette-wheel.jpg' alt='wheel'/>
        <div className="ball"></div>
      </div>
    </div>
  );
};

export default Wheel;