import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faComment, 
  faUser, 
  faBan,
  faCrown,
  faStar,
  faRefresh
} from "@fortawesome/free-solid-svg-icons";
import './LiveUsersPanel.scss';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../Spinner/Spinner';
import { useNavigate } from 'react-router';
import { setActiveChat } from '../../redux/features/chat/chatSlice';
import { normalizeDates } from '../../utils/normalizeDates';
import { userAPI } from '../../services/api/userAPI';
import { useGetBlockedUsers } from '../../hooks/useGetBlockedUsers';

const LiveUsersPanel = ({ isOpen, onClose }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { accessToken, user: currentUser } = useSelector(state => state.auth);
  const { chats } = useSelector(state => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: blockedUsersData, isLoading: isLoadingBlocked } = useGetBlockedUsers(currentUser?._id, isOpen);

  const isActuallyLoading = isLoading || isLoadingBlocked;

  const blockedUsers = useMemo(() => {
    if (!blockedUsersData) return new Set();

    return new Set(blockedUsersData.map(u => u.blockedId._id))
  }, [blockedUsersData]);

  useEffect(() => {
    if (isOpen && accessToken) {
      getOnlineUsers();
      console.log(blockedUsers);
    }
  }, [isOpen, accessToken]);

  const getOnlineUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userAPI.fetchOnlineUsers();
      if (data.success) {
        setOnlineUsers(data.users);
      } else {
        setError('Failed to fetch online users');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching online users');
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartChat = (user) => {
    const existingChat = chats.find(chat => 
      chat.participants.some(p => p._id === user._id)
    );
    
    if (existingChat) {
      const normalizedChat = normalizeDates(existingChat);
      dispatch(setActiveChat(normalizedChat));
    } else {
      const ids = [currentUser._id, user._id];
      ids.sort();
      const tempChat = normalizeDates({
        // _id: `temp_${Date.now()}`,
        _id: `temp_${ids[0]}_${ids[1]}`,
        participants: [
          { 
            _id: currentUser._id, 
            username: currentUser.username,
            profileImage: currentUser.profileImage
          },
          { 
            _id: user._id, 
            username: user.username,
            profileImage: user.profileImage
          }
        ],
        isTemp: true,
        lastActivity: new Date()
      });
      dispatch(setActiveChat(tempChat));
    }
    
    onClose();
  };

  const handleViewProfile = (userId) => {
    if (userId === currentUser._id) {
      navigate('/dashboard');
    } else {
      navigate(`/profile/${userId}`);
    }
    onClose();
  };

  const handleBlockUser = (userId) => {
    console.log("Block user:", userId);
    //TODO
  };

  const formatChips = (chips) => {
    return chips?.toLocaleString('en-US') || '0';
  };

  const isOnlyCurrentUserOnline = onlineUsers.length === 1 && 
                                 currentUser && 
                                 onlineUsers[0]._id === currentUser._id;

  const handleRetry = () => {
    getOnlineUsers();
  };

  // const filteredUsers = onlineUsers.filter(user =>
  //   user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  const processedUsers = useMemo(() => {
    console.log("baa")
    return onlineUsers.map(user => ({
      ...user,
      isBlocked: blockedUsers.has(user._id)
    })).filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) 
      );
  }, [onlineUsers, blockedUsers, searchTerm]);

  if (!isOpen) return null;

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="live-users-panel">
        <div className="panel-header">
          <h2>
            <span className="live-indicator"></span>
            Online Players
            <span className="online-count">({isActuallyLoading ? '...' : onlineUsers.length})</span>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="users-list">
          {isActuallyLoading ? (
            <div className="loading-container">
              <LoadingSpinner />
              <p>Loading online players...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <FontAwesomeIcon icon={faTimes} className="error-icon" />
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-btn">
                <FontAwesomeIcon icon={faRefresh} /> Try Again
              </button>
            </div>
          ) : isOnlyCurrentUserOnline ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>You're the only one online</h3>
              <p>No other active users at the moment</p>
              <small>Invite friends to join the fun!</small>
            </div>
          ) : processedUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No players found</h3>
              <p>Try adjusting your search terms</p>
            </div>
          ) : (
            processedUsers.map(user => (
              <div key={user._id} className={`user-card ${user.isBlocked ? 'is-blocked' : ''}`}>
                <div className="user-info">
                  <div className="avatar-container">
                    {user.profileImage && user.profileImage !== "/images/user.png" ? (
                      <img 
                        src={`http://localhost:3000${user.profileImage}`} 
                        alt={user.username}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                    <div className="avatar-placeholder">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    )}
                    {!user.isBlocked && (
                      <div className={`status-indicator ${user.isOnline && 'online'}`}></div>
                    )}

                    {user.isBlocked && (
                      <div className="blocked-overlay">
                        <FontAwesomeIcon icon={faBan} />
                      </div>
                    )}

                  </div>
                  
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
                      {/* <span className="user-status">{user.status || 'online'}</span> */}
                    </div>
                    {user.isBlocked && (
                      <p>Blocked</p>
                    )}
                    {user._id === currentUser._id && (
                      <div className="chips-info">
                        <FontAwesomeIcon icon={faStar} className="chips-icon" />
                        <span className="chips-amount">{formatChips(user.totalCredits)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="user-actions">
                  {user._id !== currentUser._id && (
                    <button 
                      className="action-btn chat-btn"
                      onClick={() => handleStartChat(user)}
                      disabled={user.isBlocked}
                      title={user.isBlocked ? "Unblock to chat" : "Start chat"}
                    >
                      <FontAwesomeIcon icon={user.isBlocked ? faBan : faComment} />
                    </button>
                  )}
                  
                  <button 
                    className="action-btn profile-btn"
                    onClick={() => handleViewProfile(user._id)}
                    title="View profile"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  
                  {/* {user._id !== currentUser._id && (
                    <button 
                      className="action-btn block-btn"
                      onClick={() => handleBlockUser(user._id)}
                      title="Block user"
                    >
                      <FontAwesomeIcon icon={faBan} />
                    </button>
                  )} */}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel-footer">
          <button 
            onClick={getOnlineUsers} 
            className="refresh-btn" 
            disabled={isActuallyLoading}
          >
            <FontAwesomeIcon icon={faRefresh} />
            {isActuallyLoading ? 'Refreshing...' : 'Refresh List'}
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