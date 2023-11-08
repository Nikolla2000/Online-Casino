import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';
import ChooseCardColor from './ChooseCardColor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon
import TotalCredits from './TotalCredits';

const GadgetsBar = () => {
  return (
    <div className='gadgets-bar flex flex-row'>
      <div className='sound-btn border-2 border-white font-bold'>
        <FontAwesomeIcon icon={faVolumeHigh} style={{color: "#ffffff",}} />
        {/* <FontAwesomeIcon icon={faVolumeXmark} style={{color: "#ffffff",}} /> */}
      </div>
      <div className='flex flex-col gap-2'>
        <div className='max-bets-btn text-white'>
          <button className='uppercase'>max bet</button>
        </div>
        <div className='double-btn'>
          <button className='text-uppercase text-white font-bold'>Double</button>
        </div>
      </div>
      {/* <ChooseCardColor/> */}
      <Bets/>
      <TotalCredits/>
      <SpinButton/>
    </div>
  );
};

export default GadgetsBar;