import React, { useState } from 'react';
import './UserDropdownStyles.scss'
import RegisterForm from '../../Authentication/Register/RegisterForm';
import LoginForm from '../../Authentication/Login/LoginForm';

const UserDropdown = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginrModal, setShowLoginModal] = useState(false)

  const handleClose = () => {
    setShowRegisterModal(false)
    setShowLoginModal(false)
  }

  return (
    <div className='user-dropdown'>
      <button onClick={() => setShowLoginModal(true)}>Login</button>
      <button onClick={() => setShowRegisterModal(true)}>Register</button>
      {showRegisterModal && <RegisterForm handleClose={handleClose}/>}
      {showLoginrModal && <LoginForm handleClose={handleClose}/>}
    </div>
  );
};

export default UserDropdown;