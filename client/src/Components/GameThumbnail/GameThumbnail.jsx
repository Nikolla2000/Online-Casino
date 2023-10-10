import React from 'react';
import { Link } from 'react-router-dom'
import "./GameThumbnail.scss"

const GameThumbnail = ({ data }) => {
  console.log(data.image);
  return (
    <div className='game-thumbnail-wrapper'>
      <Link to={data.linkPath}>
        <img src={data.image} alt='game-image'/>
      </Link>
    </div>
  );
};

export default GameThumbnail;