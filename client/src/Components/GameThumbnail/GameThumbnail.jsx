import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideModals, showLogin } from '../../redux/features/auth/authModalsSlice';
import LoginForm from '../Authentication/Login/LoginForm';
import "./GameThumbnail.scss";

const GameThumbnail = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user, accessToken } = useSelector(state => state.auth);
  const { showLoginModal } = useSelector(state => state.authModals);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user || !accessToken) {
      dispatch(showLogin());
    } else {
      dispatch(hideModals());
      navigate(data.linkPath);
    }
  };

  return (
    <div 
      className={`game-card ${isHovered ? 'hovered' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="game-card-inner">
        <div className="game-media">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="game-video"
          >
            <source src={data.image} type="video/mp4" />
          </video>
          <div className="game-overlay">
            <div className="play-button">
              <span className="play-icon">▶</span>
              <span className="play-text">PLAY NOW</span>
            </div>
          </div>
        </div>

        <div className="game-content">
          <h3 className="game-title">{data.gameName}</h3>
          <p className="game-description">{data.description || 'Experience the thrill'}</p>
          <div className="game-features">
            <span className="feature-tag">Popular</span>
            <span className="feature-tag">Jackpots</span>
          </div>
        </div>
      </div>

      {showLoginModal && <LoginForm isFromGamesPage={true} gameLink={data.linkPath} />}
    </div>
  );
};

export default GameThumbnail;