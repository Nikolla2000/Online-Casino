import React, { useContext, useEffect } from 'react';
import './UserDropdownStyles.scss'
import RegisterForm from '../../Authentication/Register/RegisterForm';
import LoginForm from '../../Authentication/Login/LoginForm';
import { UserContext } from '../../../../context/userContext';
import axios from '../../../axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import { hideModals, showLogin, showRegister } from '../../../redux/features/auth/authModalsSlice';
import { Link, useNavigate } from 'react-router-dom';
import { logout, logoutUser } from '../../../redux/features/auth/authSlice';

const UserDropdown = ({ show, play, setShowDropdown }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showLoginModal, showRegisterModal } = useSelector(state => state.authModals)

  // const {user} = useContext(UserContext)
  // console.log(user);

  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleClose = () => {
    dispatch(hideModals())
  }

  const loginOrLogout = async () => {
    alert("BAA");
    if (user) {
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

  const showLoginForm = () => {
    dispatch(showLogin());
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  

  return (
    <div className={`user-dropdown ${!show? 'reverse' : ''}`}>
      <div className="user-dropdown-img">
        <img src='/images/user.png' alt='user-img' />
      </div>
      {user && <h3 className='text-white text-xl'>Welcome, {user.firstName}!</h3>}
      <div className="dropdown-buttons">
        {user?.firstName && <button><Link to='dashboard' className='text-capitalize'>Profile</Link></button>}
        <button>
        {/* <button onClick={user ? loginOrLogout : handleLogout}> */}
          {!user?.firstName ? <span onClick={showLoginForm}>Login</span> : <span onClick={handleLogout}>Logout</span>}
        </button>
        {!user?.firstName && <button onClick={() => dispatch(showRegister())}>Register</button>}
      </div>
      {showRegisterModal && <RegisterForm handleClose={handleClose} setShowDropdown={setShowDropdown}/>}
      {showLoginModal && <LoginForm handleClose={handleClose} setShowDropdown={setShowDropdown}/>}
    </div>
  );
};

export default UserDropdown;