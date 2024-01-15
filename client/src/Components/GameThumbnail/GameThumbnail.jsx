import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import "./GameThumbnail.scss"
import {  Button } from 'react-bootstrap'
import { UserContext } from '../../../context/userContext';
import { useDispatch, useSelector } from 'react-redux';
import { hideModals, showLogin } from '../../redux/features/auth/authModalsSlice';
import LoginForm from '../Authentication/Login/LoginForm';

const GameThumbnail = ({ data }) => {
  const { user } = useContext(UserContext);

  const dispatch = useDispatch()
  const { showLoginModal } = useSelector(state => state.authModals)

  const navigate = useNavigate()

  const handleClick = () => {
    if(!user.name) {
      dispatch(showLogin())
    }
    else {
      dispatch(hideModals())
      navigate(data.linkPath)
    }
  }
  return (
    <div className='game-wrapper'>
      <div onClick={handleClick}>
          {/* <Button className='play-btn'> */}
      <div className='game-thumbnail-wrapper'>
      <video autoPlay loop muted src={data.image} style={{ width: '230px', height: '300px', objectFit: 'cover', borderRadius: '30px' }}>
        <img src={data.rouletteImg} alt="game-image" />
      </video>
        {showLoginModal && <LoginForm/>}
      </div>
          {/* </Button> */}
          <h4 className='game-name'>{data.gameName}</h4>
      </div>
    </div>
  );
};

export default GameThumbnail;