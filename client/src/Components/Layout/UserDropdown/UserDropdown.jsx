import React, { useContext } from 'react';
import './UserDropdownStyles.scss'
import RegisterForm from '../../Authentication/Register/RegisterForm';
import LoginForm from '../../Authentication/Login/LoginForm';
import { UserContext } from '../../../../context/userContext';
import axios from '../../../axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import { hideModals, showLogin, showRegister } from '../../../redux/features/auth/authModalsSlice';
import { Link, useNavigate } from 'react-router-dom';

const UserDropdown = ({ show, play }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showLoginModal, showRegisterModal } = useSelector(state => state.authModals)

  const {user} = useContext(UserContext)

  const handleClose = () => {
    dispatch(hideModals())
  }

  const loginOrLogout = async () => {
    if (user.name) {
      try {
        await axios.get('/user/logout');
  
        navigate('/');
        location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      dispatch(showLogin());
    }
  };
  

  return (
    <div className={`user-dropdown ${!show? 'reverse' : ''}`}>
      <div className="user-dropdown-img">
        <img src='../../../src/assets/images/user.png' alt='user-img' />
      </div>
      {user.name && <h3 className='text-white text-xl'>Welcome, {user.name}!</h3>}
      <div className="dropdown-buttons">
        {user.name && <button><Link to='dashboard' className='text-capitalize'>Profile</Link></button>}
        <button onClick={loginOrLogout}>
          {!user.name ? 'Login' : 'Logout'}
        </button>
        {!user.name && <button onClick={() => dispatch(showRegister())}>Register</button>}
      </div>
      {showRegisterModal && <RegisterForm handleClose={handleClose}/>}
      {showLoginModal && <LoginForm handleClose={handleClose}/>}
    </div>
  );
};

export default UserDropdown;