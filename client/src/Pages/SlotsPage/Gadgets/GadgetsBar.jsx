import React from 'react';
import SpinButton from './SpinButton';
import './GadgetsStyles.scss'
import Bets from './Bets';
import ChooseCardColor from './ChooseCardColor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import TotalCredits from './TotalCredits';
import { useDispatch } from 'react-redux';
import { maxBet } from '../../../redux/features/slots/slotMachineSlice';

const GadgetsBar = () => {
  const dispatch = useDispatch()
  
  const maxBets = () => {
    dispatch(maxBet())
  }

  return (
    <div className='gadgets-bar flex flex-row'>
      <div className='sound-btn border-2 border-white font-bold'>
        <FontAwesomeIcon icon={faVolumeHigh} style={{color: "#ffffff",}} />
        {/* <FontAwesomeIcon icon={faVolumeXmark} style={{color: "#ffffff",}} /> */}
      </div>
      <div className='flex flex-col gap-2'>
        <div className='max-bets-btn text-white'>
          <button className='uppercase' onClick={maxBets}>
            max bet
          </button>
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