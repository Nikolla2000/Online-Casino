import React from 'react';
import { useSelector } from 'react-redux';

const Wheel = () => {
  const isBallSpinning = useSelector(state => state.roulette.isBallSpinning);
  const isWheelSpinning = useSelector(state => state.roulette.isWheelSpinning);
  const result = useSelector(state => state.roulette.result);

  return (
    <div className={`roulette-wheel ${isWheelSpinning ? 'wheel-animation' : ''}`}>
      <div className="roulette-img-wrapper">
        <img src='../../src/assets/images/roulette/roulette-wheel-nobg.png' alt='wheel'/>
        {isBallSpinning && <div className="ball"></div>}
        {result !== null && (
          <div className="result-number">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wheel;
