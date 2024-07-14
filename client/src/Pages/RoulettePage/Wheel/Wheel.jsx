import React from 'react';
import { useSelector } from 'react-redux';

const Wheel = () => {
  const isBallSpinning = useSelector(state => state.roulette.isBallSpinning);
  const isWheelSpinning = useSelector(state => state.roulette.isWheelSpinning);

  return (
    <div className={`roulette-wheel ${isWheelSpinning ? 'wheel-animation' : ''}`}>
      <div className="roulette-img-wrapper">
        <img src='../../src/assets/images/roulette/roulette-wheel-nobg.png' alt='wheel'/>
        {isBallSpinning && <div className="ball"></div>}
      </div>
    </div>
  );
};

export default Wheel;