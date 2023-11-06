import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';

const GadgetsBar = () => {
  return (
    <div className='gadgets-bar flex flex-row'>
      <Bets/>
      <SpinButton/>
    </div>
  );
};

export default GadgetsBar;