import React from 'react';
import "./GameThumbnail.scss"

const GameThumbnail = ({ data }) => {
  console.log(data.image);
  return (
    <div className='game-thumbnail-wrapper'>
      <img src={data.image} alt='game-image'/>
    </div>
  );
};

export default GameThumbnail;