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
  const { showLoginModal, showRegisterModal } = useSelector(state => state.authModals)

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
      <div className='game-thumbnail-wrapper'>
          <img src={data.image} alt='game-image'/>
      <div onClick={handleClick}>
          <Button className='play-btn'>
            Play
          </Button>
        {showLoginModal && <LoginForm/>}
      </div>
      </div>
    </div>
  );
};

export default GameThumbnail;