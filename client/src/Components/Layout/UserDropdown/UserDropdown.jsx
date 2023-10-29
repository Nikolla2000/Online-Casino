import React, { useContext, useState } from 'react';
import './UserDropdownStyles.scss'
import RegisterForm from '../../Authentication/Register/RegisterForm';
import LoginForm from '../../Authentication/Login/LoginForm';
import { UserContext } from '../../../../context/userContext';

const UserDropdown = ({ show, play }) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginrModal, setShowLoginModal] = useState(false)
  const {user} = useContext(UserContext)

  const handleClose = () => {
    setShowRegisterModal(false)
    setShowLoginModal(false)
  }

  return (
    <div className={`user-dropdown ${!show? 'reverse' : ''}`}>
      <div className="user-dropdown-img">
        <img src='../../../src/assets/images/user.png' alt='user-img' />
      </div>
      {user && <h3 className='text-white text-xl'>Welcome, {user.name}!</h3>}
      <div className="dropdown-buttons">
        <button onClick={() => setShowLoginModal(true)}>
          {!user ? 'Login' : 'Logout'}
        </button>
        <button onClick={() => setShowRegisterModal(true)}>Register</button>
      </div>
      {showRegisterModal && <RegisterForm handleClose={handleClose}/>}
      {showLoginrModal && <LoginForm handleClose={handleClose}/>}
    </div>
  );
};

export default UserDropdown;