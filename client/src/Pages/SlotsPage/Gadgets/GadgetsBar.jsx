import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';
import ChooseCardColor from './ChooseCardColor';

const GadgetsBar = () => {
  return (
    <div className='gadgets-bar flex flex-row'>
      <Bets/>
      <div className='double-btn'>
        <button className='text-uppercase text-white font-bold'>Double</button>
      </div>
      <ChooseCardColor/>
      <div className='max-bets-btn text-white'>
        <button className='uppercase'>max bet</button>
      </div>
      <SpinButton/>
    </div>
  );
};

export default GadgetsBar;