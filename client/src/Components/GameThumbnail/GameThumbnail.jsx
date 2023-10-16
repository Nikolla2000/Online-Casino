import React from 'react';
import { Link } from 'react-router-dom'
import "./GameThumbnail.scss"
import {  Button } from 'react-bootstrap'

const GameThumbnail = ({ data }) => {
  console.log(data.image);
  return (
    <div className='game-wrapper'>
    <div className='game-thumbnail-wrapper'>
        <img src={data.image} alt='game-image'/>
    </div>
      <Link to={data.linkPath}>
        <Button variant='success' className='play-btn'>
          Play
        </Button>
      </Link>
    </div>
  );
};

export default GameThumbnail;