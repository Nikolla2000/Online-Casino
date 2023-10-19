import React, { useState } from 'react';
import './UserDropdownStyles.scss'
import RegisterForm from '../../Authentication/Register/RegisterForm';

const UserDropdown = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const handleClose = () => {
    setShowRegisterModal(false)
  }
  return (
    <div className='user-dropdown'>
      <button>Login</button>
      <button onClick={() => setShowRegisterModal(true)}>Register</button>
      {showRegisterModal && <RegisterForm handleClose={handleClose}/>}
    </div>
  );
};

export default UserDropdown;