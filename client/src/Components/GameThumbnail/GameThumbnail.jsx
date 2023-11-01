import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import "./GameThumbnail.scss"
import {  Button } from 'react-bootstrap'
import { UserContext } from '../../../context/userContext';

const GameThumbnail = ({ data }) => {
  const { user } = useContext(UserContext)

  const handleClick = () => {
    if(!user.name) {
      return
    }
  }
  return (
    <div className='game-wrapper'>
      <div className='game-thumbnail-wrapper'>
          <img src={data.image} alt='game-image'/>
      <div onClick={handleClick}>
        <Link to={data.linkPath}>
          <Button className='play-btn'>
            Play
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default GameThumbnail;