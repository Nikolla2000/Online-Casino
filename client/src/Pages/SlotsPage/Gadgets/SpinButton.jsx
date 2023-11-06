import React from 'react';
import './GadgetsStyles.scss'

const SpinButton = ({ randomSlotItem }) => {
  return (
    <div className='spin-btn'>
      <button onClick={() => randomSlotItem()}>
        Spin
      </button>
    </div>
  );
};

export default SpinButton;