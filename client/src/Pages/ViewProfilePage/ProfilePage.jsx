import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';
import { getCountryFlag } from '../../utils/countries';
import { formatTimeAgo, getMemberDuration } from '../../utils/timeFormatter';
import ProfileSkeleton from '../../Components/Skeletons/ProfileSkeleton/ProfileSkeleton';
import './ProfilePageStyles.scss';
import BlockButton from '../../Components/BlockButton/BlockButton';
import MessageButton from '../../Components/MessageButton/MessageButton,';
import { userAPI } from '../../services/api/userAPI';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const blockModalRef = useRef(null);
  const { data: userData, isLoading, error } = useUserData(userId);

  const handleMessage = () => {}

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (showBlockConfirm && blockModalRef.current && !blockModalRef.current.contains(e.target)) {
            setShowBlockConfirm(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener(' mousedown', handleClickOutside)
    }
  }, [showBlockConfirm])

  const handleOpenBlock = () => {
    setShowBlockConfirm(true);
  }

  const handleConfirmBlock = async () => {
    await userAPI.blockUser(userData._id);
  }

  const handleCancelBlock = () => {
    setShowBlockConfirm(false);
  }

  if (isLoading) {
    return (
      <div className="user-profile-page">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="profile-error">
          <div className="error-icon">❌</div>
          <h2>User Not Found</h2>
          <p>The user you're looking for doesn't exist or has been removed.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div className="header-background"></div>
          <div className="header-content">
            <div className="profile-image-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <img 
                  src={userData.profileImage !== "/images/user.png" 
                    ? `http://localhost:3000${userData.profileImage}` 
                    : "/images/user.png"
                  } 
                  alt={userData.username}
                />

              </div>
                <div className={`online-indicator ${userData.isOnline ? 'online' : 'offline'}`}>
                  {userData.isOnline ? '🟢' : '⚫'}
                </div>
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="profile-username">@{userData.username}</p>
              
              <div className="profile-badges">
                <div className={`vip-badge ${userData.isVip ? 'vip' : 'regular'}`}>
                  {userData.isVip ? '👑 VIP Member' : '⭐ Player'}
                </div>
                {userData.isVerified && (
                  <div className="verified-badge">
                    ✓ Verified
                  </div>
                )}
                <div className={`status-badge ${userData.isOnline ? 'online' : 'offline'}`}>
                  {userData.isOnline ? 'Online' : `Last seen ${formatTimeAgo(userData.lastSeen)}`}
                </div>
                {/* <button className="action-btn-badge message" style={{marginBottom: 0}} onClick={() => handleStartChat(userData)}>
                    <span>Message</span>
                </button> */}
                {/* <button className="action-btn-badge block" onClick={handleOpenBlock}>
                    <span>Block</span>
                </button> */}
                <MessageButton/>
                <BlockButton setShowBlockConfirm={setShowBlockConfirm}/>
              </div>

              {userData.country && userData.country !== 'unknown' && (
                <div className="profile-location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">{userData.country}</span>
                  <span className="location-flag">{getCountryFlag(userData.country)}</span>
                </div>
              )}

              <div className="member-info">
                <span className="member-icon">🗓️</span>
                Member for {getMemberDuration(userData.registrationDate)}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">
                {userData.totalWagered.toLocaleString()}
                <img src='/images/casino-chips.png' className='chips-img' alt="chips"/>
              </div>
              <div className="stat-label">Total Wagered</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">
                {userData.totalWon.toLocaleString()}
                <img src='/images/casino-chips.png' className='chips-img' alt="chips"/>
              </div>
              <div className="stat-label">Total Won</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-value">{userData.gamesPlayed}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {userData.totalWagered > 0 
                  ? ((userData.totalWon / userData.totalWagered) * 100).toFixed(1)
                  : '0.0'
                }%
              </div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
        </div>

        <div className="profile-activity">
          <h3 className="section-title">Player Activity</h3>
          
          {userData.gamesPlayed === 0 ? (
            <div className="no-activity">
              <div className="no-activity-icon">🎰</div>
              <p>This player hasn't played any games yet</p>
            </div>
          ) : (
            <div className="activity-summary">
              <div className="summary-item">
                <span className="summary-label">Joined</span>
                <span className="summary-value">
                  {new Date(userData.registrationDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Account Status</span>
                <span className={`summary-value ${userData.isVerified ? 'verified' : 'unverified'}`}>
                  {userData.isVerified ? '✓ Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">VIP Status</span>
                <span className="summary-value">
                  {userData.isVip ? '👑 Gold Member' : '⭐ Regular Player'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="action-btn secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      {showBlockConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal block-confirmation-modal" ref={blockModalRef}>
            <h4>Block user</h4>
            <p>Are you sure you want to block {userData.username}?</p>
            <div className="confirmation-actions">
              <button className="confirm-btn" onClick={handleConfirmBlock}>
                Yes
              </button>
              <button className="cancel-btn" onClick={handleCancelBlock}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;