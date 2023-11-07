import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';

const GadgetsBar = () => {
  return (
    <div className='gadgets-bar flex flex-row'>
      <Bets/>
      <div className='max-bets-btn text-white'>
        <button className='uppercase'>max bet</button>
      </div>
      <SpinButton/>
    </div>
  );
};

export default GadgetsBar;