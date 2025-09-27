import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { hideModals, showRegister } from '../../../redux/features/auth/authModalsSlice';
import { useForm } from "react-hook-form";
import { fetchCurrentUser, login } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGem, faXmark } from "@fortawesome/free-solid-svg-icons";
import './LoginStyles.scss';
import LoginGoogleBtn from '../../Oauth/LoginGoogleBtn';

const LoginForm = ({ handleClose, setShowDropdown }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isFromGamesPage, gameLink } = useSelector(state => state.authModals);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleShowRegister = () => {
    dispatch(showRegister());
  }

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(login(data));

      if (login.fulfilled.match(res)) {
        toast.success('Login successful! 🎰');
        const token = res.payload.accessToken;
        await dispatch(fetchCurrentUser(token));
        setTimeout(() => {
          if(isFromGamesPage) {
            navigate(gameLink);
          } else {
            navigate("/");
          }
        }, 400);
        dispatch(hideModals());
        if (setShowDropdown) setShowDropdown(false);
      } else {
        toast.error('Invalid username or password');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  }

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="login-modal"
      aria-describedby="login-form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Box className="login-modal-container">
        <div className="login-modal-header">
          <div className="login-icon">
            <FontAwesomeIcon icon={faGem} />
          </div>
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Sign in to continue your gaming journey</p>
          <button className="close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              {...register("username", { 
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters"
                }
              })}
              className={errors.username ? 'error' : ''}
            />
            <div className="input-underline"></div>
          </div>
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}

          <div className="input-group">
            <div className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className={errors.password ? 'error' : ''}
              />
            <div className="input-underline"></div>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
            )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
            >
            {isSubmitting ? (
              <div className="spinner"></div>
              ) : (
                'LOGIN TO PLAY'
                )}
          </button>
        </form>
        
        <LoginGoogleBtn/>

        <div className="login-modal-footer">
          <p className="register-text">
            Don't have an account?{" "}
            <span className="register-link" onClick={handleShowRegister}>
              Join the casino now!
            </span>
          </p>
          <div className="bonus-offer">
            <span className="bonus-chip">🎰</span>
            <span className="bonus-text">Get 1000 FREE chips on registration!</span>
          </div>
        </div>

        <div className="modal-glitter"></div>
        <div className="modal-shine"></div>
      </Box>
    </Modal>
  );
};

export default LoginForm;