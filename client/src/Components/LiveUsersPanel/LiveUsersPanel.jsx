import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faComment, 
  faUser, 
  faBan,
  faCrown,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import './LiveUsersPanel.scss';
import { useSelector } from 'react-redux';
import { fetchOnlineUsers } from '../../lib/data';
import LoadingSpinner from '../Spinner/Spinner';

const LiveUsersPanel = ({ isOpen, onClose }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, user: currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    if (isOpen && accessToken) {
      getOnlineUsers();
    }
  }, [isOpen]);

  const getOnlineUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOnlineUsers();
      if (data.success) {
        setOnlineUsers(data.users);
      } else {
        setError('Failed to fetch online users');
      }
    } catch (error) {
      setError(err.response?.data?.message || 'Error fetching online users');
    } finally {
      setIsLoading(false);
      console.log(onlineUsers);
    }
  }

  const handleStartChat = (userId) => {
    console.log("Start chat with user:", userId);
  };

  const handleViewProfile = (userId) => {
    console.log("View profile of user:", userId);
  };

  const handleBlockUser = (userId) => {
    console.log("Block user:", userId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "online": return "#4CAF50";
      case "playing": return "#2196F3";
      case "away": return "#FF9800";
      default: return "#9E9E9E";
    }
  };

  const formatChips = (chips) => {
    return chips.toLocaleString('en-US');
  };

  const isOnlyCurrentUserOnline = onlineUsers.length === 1 && 
                                 currentUser && 
                                 onlineUsers[0]._id === currentUser._id;

  const handleRetry = () => {
    getOnlineUsers();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="live-users-panel">
        <div className="panel-header">
          <h2>
            <span className="live-indicator"></span>
            Online Players
            <span className="online-count">({isLoading ? '...' : onlineUsers.length})</span>
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="panel-search">
          <input 
            type="text" 
            placeholder="Search players..."
            className="search-input"
          />
        </div>

        <div className="users-list">
          {isLoading ? (
            // <div className="loading-state">
            //   <div className="spinner"></div>
            //   <p>Loading online players...</p>
            // </div>
            <LoadingSpinner/>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-btn">
                Retry
              </button>
            </div>
          ) : isOnlyCurrentUserOnline ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>You're the only one online</h3>
              <p>No other active users at the moment</p>
              <small>Invite friends to join the fun!</small>
            </div>
          ) : (
            onlineUsers.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  {/* <div className="avatar-container">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="user-avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    ></div>
                  </div> */}
                  
                  <div className="user-details">
                    <div className="username-row">
                      <span className="username">
                        {user.username}
                        {user.isVip && (
                          <FontAwesomeIcon icon={faCrown} className="vip-icon" />
                        )}
                        {currentUser && user._id === currentUser._id && (
                          <span className="you-badge">(You)</span>
                        )}
                      </span>
                      <span className="user-status">{user.status}</span>
                    </div>
                    
                    <div className="chips-info">
                      <FontAwesomeIcon icon={faStar} className="chips-icon" />
                      <span className="chips-amount">{formatChips(user.totalCredits)}</span>
                    </div>
                  </div>
                </div>
  
                <div className="user-actions">
                  <button 
                    className="action-btn chat-btn"
                    onClick={() => handleStartChat(user.id)}
                    title="Start chat"
                  >
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                  
                  <button 
                    className="action-btn profile-btn"
                    onClick={() => handleViewProfile(user.id)}
                    title="View profile"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  
                  <button 
                    className="action-btn block-btn"
                    onClick={() => handleBlockUser(user.id)}
                    title="Block user"
                  >
                    <FontAwesomeIcon icon={faBan} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel-footer">
        <button onClick={getOnlineUsers} className="refresh-btn" disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className="legend">
            <div className="legend-item">
              <div className="status-dot online-dot"></div>
              <span>Online</span>
            </div>
            <div className="legend-item">
              <div className="status-dot playing-dot"></div>
              <span>Playing</span>
            </div>
            <div className="legend-item">
              <div className="status-dot away-dot"></div>
              <span>Away</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveUsersPanel;