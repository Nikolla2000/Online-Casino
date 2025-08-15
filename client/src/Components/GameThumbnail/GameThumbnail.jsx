import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import "./GameThumbnail.scss"
import { UserContext } from '../../../context/userContext';
import { useDispatch, useSelector } from 'react-redux';
import { hideModals, showLogin } from '../../redux/features/auth/authModalsSlice';
import LoginForm from '../Authentication/Login/LoginForm';

const GameThumbnail = ({ data, firstAnimation, secondAnimation }) => {
  // const { user } = useContext(UserContext);
  const { user } = useSelector(state => state.auth);
  const { accessToken } = useSelector(state => state.auth);

  const dispatch = useDispatch()
  const { showLoginModal } = useSelector(state => state.authModals)

  const navigate = useNavigate()

  const handleClick = () => {
    if(!user || !accessToken) {
      dispatch(showLogin())
    }
    else {
      dispatch(hideModals())
      navigate(data.linkPath)
    }
  }
  return (
    // <div className={`game-wrapper ${data.gameName == 'Slots' ? firstAnimation  : secondAnimation}`}>
     <div className={`game-wrapper`}>
      <div onClick={handleClick}>
      <div className='game-thumbnail-wrapper'>
      <video autoPlay loop muted src={data.image} style={{ width: '230px', height: '300px', objectFit: 'cover', borderRadius: '10px' }}>
      </video>
        {data.rouletteImg && <img className='game-image' src={data.rouletteImg} alt="game-image" />}
        {showLoginModal && <LoginForm isFromGamesPage={true} gameLink={data.linkPath}/>}
      </div>
          <h4 className={`game-name ${data.gameName == 'Roulette' && 'left'}`}>{data.gameName}</h4>
      </div>
    </div>
  );
};

export default GameThumbnail;