import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faSignOutAlt, 
  faSignInAlt, 
  faUserPlus,
  faCog,
  faCoins,
  faCrown,
  faIdCard,
  faGem,
  faWallet,
  faHistory
} from "@fortawesome/free-solid-svg-icons";
import './UserDropdownStyles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { showLogin, showRegister } from '../../../redux/features/auth/authModalsSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/features/auth/authSlice';

const UserDropdown = ({ show, setShowDropdown }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector(state => state.auth);

  const handleAction = (action) => {
    action();
    setShowDropdown(false);
  };

  const handleLogin = () => handleAction(() => dispatch(showLogin()));
  const handleRegister = () => handleAction(() => dispatch(showRegister()));
  const handleNavigate = (path) => handleAction(() => navigate(path));

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setShowDropdown(false);
      // navigate('/');
      window.location.href = "/";
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="dropdown-overlay" onClick={() => setShowDropdown(false)} />
      <div className="user-dropdown-container">
        <div className="user-dropdown-content">
          <div className="user-header">
            <div className="user-avatar">
              {user?.profileImage && user.profileImage !== "/images/user.png" ? (
                <img 
                  src={`http://localhost:3000${user.profileImage}?${Date.now()}`} 
                  alt="Profile" 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              {user?.isVip && (
                <div className="vip-badge">
                  <FontAwesomeIcon icon={faCrown} />
                </div>
              )}
            </div>
            
            <div className="user-info">
              {user ? (
                <>
                  <h3 className="username">Welcome, {user.firstName}!</h3>
                  <div className="user-stats">
                    <div className="chip-balance">
                      <FontAwesomeIcon icon={faCoins} className="chip-icon" />
                      <span className="balance">{user.totalCredits?.toLocaleString() || '0'}</span>
                    </div>
                    {user.isVip && (
                      <div className="vip-status">
                        <FontAwesomeIcon icon={faGem} className="vip-icon" />
                        <span>VIP Member</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <h3 className="guest-title">Welcome, Guest!</h3>
              )}
            </div>
          </div>

          <div className="drpdown-menu">
            {user ? (
              // LOGGED IN
              <>
                <div className="menu-section">
                  <div className="menu-item" onClick={() => handleNavigate('/dashboard')}>
                    <FontAwesomeIcon icon={faIdCard} className="menu-icon" />
                    <span>Profile</span>
                  </div>
                  
                  <div className="menu-item" onClick={() => handleNavigate('/wallet')}>
                    <FontAwesomeIcon icon={faWallet} className="menu-icon" />
                    <span>Wallet</span>
                  </div>
                  
                  <div className="menu-item" onClick={() => handleNavigate('/dashboard?section=history')}>
                    <FontAwesomeIcon icon={faHistory} className="menu-icon" />
                    <span>Game History</span>
                  </div>
                  
                  <div className="menu-item" onClick={() => handleNavigate('/dashboard?section=account')}>
                    <FontAwesomeIcon icon={faCog} className="menu-icon" />
                    <span>Settings</span>
                  </div>
                </div>

                <div className="menu-divider"></div>

                <div className="menu-item logout-item" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              // NOT LOGGED IN
              <>
                <div className="menu-section">
                  <div className="menu-item login-item" onClick={handleLogin}>
                    <FontAwesomeIcon icon={faSignInAlt} className="menu-icon" />
                    <span>Login</span>
                  </div>
                  
                  <div className="menu-item register-item" onClick={handleRegister}>
                    <FontAwesomeIcon icon={faUserPlus} className="menu-icon" />
                    <span>Register</span>
                  </div>
                </div>

                <div className="menu-divider"></div>
                
                <div className="promo-text">
                  <p>Join now and get</p>
                  <div className="bonus-chip">🎰 1000 FREE CHIPS</div>
                  <p className="bonus-subtext">to start playing!</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="dropdown-corner"></div>
        <div className="dropdown-glitter"></div>
      </div>
    </>
  );
};

export default UserDropdown;