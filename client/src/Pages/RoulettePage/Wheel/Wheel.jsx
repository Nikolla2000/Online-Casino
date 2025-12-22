import React from 'react';
import { useSelector } from 'react-redux';

const Wheel = () => {
  const {
    isBallSpinning,
    isWheelSpinning,
    result
  } = useSelector(state => state.roulette);

  return (
    <div className={`roulette-wheel 
      ${isWheelSpinning ? 'wheel-animation' : ''} 
      ${isBallSpinning ? 'ball-spinning' : ''}
    `}>
      <div className="roulette-img-wrapper">
        <img src='/images/roulette/roulette-wheel-nobg.png' alt='wheel'/>
        {isBallSpinning && <div className="ball"></div>}
        {result !== null && (
          <div className={`result-number ${result.color === 'red' ? 'result-number-red' : 'result-number-black'}`}>
            {result.randNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wheel;
