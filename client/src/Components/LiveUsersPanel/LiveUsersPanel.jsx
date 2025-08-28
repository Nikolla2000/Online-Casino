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

const LiveUsersPanel = ({ isOpen, onClose }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Mock data
  useEffect(() => {
    const mockUsers = [
      { id: 1, username: "JohnDoe", avatar: null, status: "online", isVip: true, chips: 12500 },
      { id: 2, username: "CasinoQueen", avatar: null, status: "playing", isVip: false, chips: 8500 },
      { id: 3, username: "LuckyJack", avatar: null, status: "online", isVip: true, chips: 250000 },
      { id: 4, username: "PokerKing", avatar: null, status: "away", isVip: false, chips: 17500 },
      { id: 5, username: "DiamondBetty", avatar: null, status: "online", isVip: true, chips: 42000 },
      { id: 6, username: "RouletteMaster", avatar: null, status: "playing", isVip: false, chips: 9500 },
      { id: 7, username: "SlotWinner", avatar: null, status: "online", isVip: true, chips: 150000 },
      { id: 8, username: "BlackjackPro", avatar: null, status: "online", isVip: false, chips: 28000 },
    ];
    setOnlineUsers(mockUsers);
  }, []);

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

  if (!isOpen) return null;

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="live-users-panel">
        <div className="panel-header">
          <h2>
            <span className="live-indicator"></span>
            Online Players
            <span className="online-count">({onlineUsers.length})</span>
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
          {onlineUsers.map(user => (
            <div key={user.id} className="user-card">
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
                    </span>
                    <span className="user-status">{user.status}</span>
                  </div>
                  
                  <div className="chips-info">
                    <FontAwesomeIcon icon={faStar} className="chips-icon" />
                    <span className="chips-amount">{formatChips(user.chips)}</span>
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
          ))}
        </div>

        <div className="panel-footer">
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