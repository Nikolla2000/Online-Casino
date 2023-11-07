import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';
import ChooseCardColor from './ChooseCardColor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon

const GadgetsBar = () => {
  return (
    <div className='gadgets-bar flex flex-row'>
      <div className='sound-btn border-2 border-white font-bold'>
        <FontAwesomeIcon icon={faVolumeHigh} style={{color: "#ffffff",}} />
        {/* <FontAwesomeIcon icon={faVolumeXmark} style={{color: "#ffffff",}} /> */}
      </div>
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