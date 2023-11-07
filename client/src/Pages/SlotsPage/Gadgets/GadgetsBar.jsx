import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';
import ChooseCardColor from './ChooseCardColor';

const GadgetsBar = () => {
  return (
    <div className='gadgets-bar flex flex-row'>
      <Bets/>
      <ChooseCardColor/>
      <div className='max-bets-btn text-white'>
        <button className='uppercase'>max bet</button>
      </div>
      <SpinButton/>
    </div>
  );
};

export default GadgetsBar;