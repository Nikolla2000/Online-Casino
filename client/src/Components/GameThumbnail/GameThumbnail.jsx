import React from 'react';

const GameThumbnail = ({ data }) => {
  console.log(data.image);
  return (
    <div className='game-thumnail-wrapper'>
      <img src={data.image} alt='game-image'/>
    </div>
  );
};

export default GameThumbnail;