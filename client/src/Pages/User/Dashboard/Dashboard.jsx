import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, updateProfilePic } from '../../../redux/features/auth/authSlice';
import axios from '../../../axiosConfig';
import toast from 'react-hot-toast';
import './DashboardStyles.scss';
import { getCountryFlag } from '../../../utils/countries';
import { userAPI } from '../../../services/api/userAPI';
import { useUserStats } from '../../../hooks/userUserStats';
import LoadingSpinner, { LoadingSpinnerSmall } from '../../../Components/Spinner/Spinner';
import api from '../../../axiosConfig';
import { useRecentActivity } from '../../../hooks/useRecentActivity';
import { capitalize } from '../../../utils/generalActions';
import { formatDate, formatTimeAgo } from '../../../utils/timeFormatter';
import { useGameHistory } from '../../../hooks/useGameHistory';
import Pagination from '../../../Components/Pagination/Pagination';
import { useSearchParams } from 'react-router-dom';
import SectionButton from './SectionButton';
import BlockedSection from './DashboardSections/BlockedSection';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const [activeSection, setActiveSection] = useState('stats');
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);
  const [noChangesMessage, setNoChangesMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [notificationsPrefs, setNotificationsPrefs] = useState({
    bonusOffers: user.bonusOffers || false,
    gameUpdates: user.gameUpdates || false,
    vipEvents: user.vipEvents || false
  });

  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');

  useEffect(() => {
    switch (section) {
      case 'history':
        setActiveSection('history');
        setCurrentPage(1);
        break;
      case 'account':
        setActiveSection('account');
        break;
      case 'stats':
        setActiveSection('stats');
        break;
      case 'blocked-users':
        setActiveSection('blocked-users');
        break;
      default:
        setActiveSection('stats')
    }
  }, [section]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setIsUploading(true);
      const res = await axios.post('/v1/user/uploadPicture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      dispatch(updateProfilePic(res.data.profilePic));
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      window.location.href = "/";
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleNotificationChange = (field) => {
    setNotificationsPrefs(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    if (noChangesMessage) {
      setNoChangesMessage('');
    }
  };

  const handleSaveNotifications = async () => {
    const hasChanges = 
    notificationsPrefs.bonusOffers !== user.bonusOffers ||
    notificationsPrefs.gameUpdates !== user.gameUpdates ||
    notificationsPrefs.vipEvents !== user.vipEvents;

    if (!hasChanges) {
      setNoChangesMessage('No changes were made');
      setTimeout(() => setNoChangesMessage(''), 3000);
      return;
    }

    try {
      setIsSaving(true);
      setNoChangesMessage('');

      const updatedFields = {};

      if (notificationsPrefs.bonusOffers !== user.bonusOffers) {
        updatedFields.bonusOffers = notificationsPrefs.bonusOffers;
      }
      if (notificationsPrefs.gameUpdates !== user.gameUpdates) {
        updatedFields.gameUpdates = notificationsPrefs.gameUpdates;
      }
      if (notificationsPrefs.vipEvents !== user.vipEvents) {
        updatedFields.vipEvents = notificationsPrefs.vipEvents;
      }

      const res = await userAPI.updatePreferences(updatedFields);
      console.log(res);
      toast.success('Fields updated successfully');

    } catch (err) {
      console.error('Error saving notifications prefs');
      toast.error(err.response?.data?.message || 'Error saving the fields');
    } finally {
      setIsSaving(false);
      setNoChangesMessage('');
    }
  }


  const { data: userStats, isLoading, error } = useUserStats();
  const { data: recentActivity = [], isLoading: isLoadingActivity, error: activityError } = useRecentActivity();
  const { data: gameHistoryData, isLoading: isLoadingHistory, error: historyError } = useGameHistory(currentPage, 10, activeSection === 'history');

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    document.querySelector('.game-history-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const creditPackages = [
    { credits: 1000, price: 9.99, originalPrice: null, popular: false },
    { credits: 2000, price: 18.99, originalPrice: null, popular: false },
    { credits: 5000, price: 45.99, originalPrice: null, popular: false },
    { credits: 10000, price: 89.99, originalPrice: 99.99, popular: true }
  ];

  const sectionItems = [
    { id: 'stats', label: '📊 Game Stats' },
    { id: 'account', label: '⚙️ Account Settings' },
    { id: 'history', label: '📜 Game History' },
    { id: 'vip', label: '🏆 VIP Benefits' },
    { id: 'blocked-users', label: '🚫 Blocked users' },
  ];

  return (
    <div className='casino-dashboard'>

      <div className="dashboard-header">
        <div className="header-content">
          <h1>Player Dashboard</h1>
          <div className={`vip-badge ${user.isVip ? 'vip' : 'regular'}`}>
            <span className="vip-icon">{user.isVip ? '👑' : '👤'}</span>
            {user.isVip ? 'VIP Member' : 'Regular Player'}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-image-section">
              <div className="profile-image-wrapper">
                {user.profileImage !== "/images/user.png" ? (
                  <img 
                    src={`http://localhost:3000${user.profileImage}?${Date.now()}`}  
                    alt='Profile' 
                    className={isUploading ? 'uploading' : ''}
                  />
                ) : (
                  <img 
                    src="/images/user.png"
                    alt='Default' 
                    className={isUploading ? 'uploading' : ''}
                  />
                )}
                <div 
                  className={`change-pic-button ${isUploading ? 'uploading' : ''}`}
                  onClick={triggerFileInput}
                >
                  {isUploading ? <div className="spinner"></div> : '+'}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  data-testid="profile-pic-input"
                  style={{ display: 'none' }}
                />
              </div>
              
              <div className="user-info">
                <h2>{user.firstName} {user.lastName}</h2>

                <p className="user-title">@{user.username}</p>

                <div className="member-since">
                  Member since {new Date(user.registrationDate).getFullYear()}
                </div>

                {user.country && user.country.toUpperCase() !== 'Unknown'.toUpperCase() && (
                  <div className='user-country'>
                    <span className="country-name">From {user.country}</span>
                    <span className="country-flag">
                        {getCountryFlag(user.country)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <div className='stat-value-img-wrapper'>
                  <span className="stat-value">{user.totalWagered.toLocaleString()}</span>
                  <img src='/images/casino-chips.png' className='chips-img'/>
                </div>
                <span className="stat-label">Total Wagered</span>
              </div>
              <div className="stat-item">
                {isLoading ? <div style={{marginTop:'10px'}}><LoadingSpinnerSmall/></div> : (
                  <span className="stat-value">{userStats.stats.totalRoundsPlayed}</span>
                )}
                <span className="stat-label">Rounds Played</span>
              </div>
            </div>
          </div>

          <nav className="profile-nav">
            {sectionItems.map((item) => (
              <SectionButton
                key={item.id}
                {...item}
                activeSection={activeSection}
                onClick={(id) => {
                  setActiveSection(id);
                  if (id === 'hisotry') setCurrentPage(1);
                }}
              />
            ))}

            <SectionButton
              label='Logout'
              className='logout'
              onClick={handleLogout}
            />
          </nav>
        </div>

        <div className="main-content">
          {activeSection === 'stats' && (
            <div className="content-section">
              <h3>Game Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h4>Total Credits Wagered</h4>
                    <p className="stat-number">{user.totalWagered.toLocaleString()}<img src='/images/casino-chips.png' className='chips-img'/></p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-content">
                    <h4>Total Wins</h4>
                    <p className="stat-number">{user.totalWon.toLocaleString()}<img src='/images/casino-chips.png' className='chips-img'/></p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-content">
                    <h4>Total Rounds Played</h4>
                    {isLoading ? <div style={{marginTop:'10px'}}><LoadingSpinnerSmall/></div> : (
                      <p className="stat-number">{userStats.stats.totalRoundsPlayed}</p>
                    )}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h4>Favorite Game</h4>
                    {isLoading ? <div style={{marginTop:'10px'}}><LoadingSpinnerSmall/></div> : (
                      <p className="stat-text">{capitalize(userStats.favoriteGame)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h4>Recent Activity</h4>

                {isLoadingActivity ? (
                  <LoadingSpinner/>
                ) : activityError ? (
                  <div className="activity-error">Failed to load recent activity</div>
                ) : recentActivity.length === 0 ? (
                  <div className="activity-empty">No recent activity</div>
                ) : <div className="activity-list">
                    {recentActivity.map((game) => (
                      <div key={game._id} className="activity-item">
                        <span className="activity-game">{capitalize(game.gameType)}</span>
                        <div className={`activity-result ${game.netProfit > 0 ? 'win' : 'loss'}`}>
                          {game.netProfit > 0 ? '+' : ''}{game.netProfit}
                          <img src='/images/casino-chips.png' className='chips-img'/>
                        </div>
                        <span className="activity-time">{formatTimeAgo(game.timestamp)}</span>
                      </div>
                    ))}
                    </div>
                }
              </div>
            </div>
          )}

          {activeSection === 'history' && (
            <div className="content-section game-history-section">
              <div className="section-header">
                <h3>Game History</h3>
                {gameHistoryData && (
                  <p className="history-info">
                    Showing {gameHistoryData.history.length} of {gameHistoryData.pagination.totalRecords} total games
                  </p>
                )}
              </div>

              {isLoadingHistory ? (
                <LoadingSpinner />
              ) : historyError ? (
                <div className="history-error">Failed to load game history</div>
              ) : !gameHistoryData || gameHistoryData.history.length === 0 ? (
                <div className="history-empty">
                  <p>No game history found</p>
                  <p className="empty-subtitle">Start playing to see your history here!</p>
                </div>
              ) : (
                <>
                  <div className="history-table-wrapper">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Game</th>
                          <th>Bet Amount</th>
                          <th>Win Amount</th>
                          <th>Net Profit</th>
                          <th>Balance After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameHistoryData.history.map((game) => (
                          <tr key={game._id}>
                            <td className="date-cell">{formatDate(game.timestamp)}</td>
                            <td className="game-cell">{capitalize(game.gameType)}</td>
                            <td className="bet-cell">
                              {game.betAmount}
                              <img src='/images/casino-chips.png' className='chips-img-small'/>
                            </td>
                            <td className="win-cell">
                              {game.winAmount}
                              <img src='/images/casino-chips.png' className='chips-img-small'/>
                            </td>
                            <td className={`profit-cell ${game.netProfit > 0 ? 'profit-positive' : 'profit-negative'}`}>
                              {game.netProfit > 0 ? '+' : ''}{game.netProfit}
                              <img src='/images/casino-chips.png' className='chips-img-small'/>
                            </td>
                            <td className="balance-cell">
                              {game.balanceAfter}
                              <img src='/images/casino-chips.png' className='chips-img-small'/>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={gameHistoryData.pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          )}

          {activeSection === 'vip' && (
            <div className="content-section vip-section">
              <div className="vip-header">
                <h3>VIP Benefits Program</h3>
                <p className="vip-subtitle">Unlock exclusive rewards as you play</p>
              </div>

              <div className="vip-progress-card">
                <div className="progress-header">
                  <div className="current-tier">
                    <span className="tier-icon">{user.isVip ? '👑' : '⭐'}</span>
                    <div className="tier-info">
                      <h4>{user.isVip ? 'Gold Member' : 'Regular Player'}</h4>
                      <p>Level 3 of 5</p>
                    </div>
                  </div>
                  <div className="next-tier">
                    <span className="next-label">Next Tier</span>
                    <span className="next-tier-name">💎 Platinum</span>
                  </div>
                </div>
                
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}>
                      <span className="progress-text">65%</span>
                    </div>
                  </div>
                  <p className="progress-info">Wager 3,500 more credits to reach Platinum</p>
                </div>
              </div>

              <div className="vip-tiers-grid">
                <div className="tier-card bronze">
                  <div className="tier-badge">
                    <span className="tier-icon">🥉</span>
                    <h4>Bronze</h4>
                  </div>
                  <div className="tier-requirement">0 - 1,000 wagered</div>
                  <ul className="tier-benefits">
                    <li>✓ Welcome bonus</li>
                    <li>✓ Basic support</li>
                    <li>✓ Standard withdrawal time</li>
                  </ul>
                </div>

                <div className="tier-card silver">
                  <div className="tier-badge">
                    <span className="tier-icon">🥈</span>
                    <h4>Silver</h4>
                  </div>
                  <div className="tier-requirement">1,000 - 5,000 wagered</div>
                  <ul className="tier-benefits">
                    <li>✓ 5% cashback</li>
                    <li>✓ Priority support</li>
                    <li>✓ Weekly bonuses</li>
                    <li>✓ Faster withdrawals</li>
                  </ul>
                </div>

                <div className="tier-card gold active">
                  <div className="tier-badge">
                    <span className="tier-icon">👑</span>
                    <h4>Gold</h4>
                    <div className="current-badge">YOUR TIER</div>
                  </div>
                  <div className="tier-requirement">5,000 - 20,000 wagered</div>
                  <ul className="tier-benefits">
                    <li>✓ 10% cashback</li>
                    <li>✓ Dedicated VIP manager</li>
                    <li>✓ Exclusive tournaments</li>
                    <li>✓ Instant withdrawals</li>
                    <li>✓ Birthday bonus</li>
                  </ul>
                </div>

                <div className="tier-card platinum locked">
                  <div className="tier-badge">
                    <span className="tier-icon">💎</span>
                    <h4>Platinum</h4>
                  </div>
                  <div className="tier-requirement">20,000 - 50,000 wagered</div>
                  <ul className="tier-benefits">
                    <li>✓ 15% cashback</li>
                    <li>✓ VIP events access</li>
                    <li>✓ Personal account manager</li>
                    <li>✓ Luxury gifts</li>
                    <li>✓ Higher bet limits</li>
                    <li>✓ Custom bonuses</li>
                  </ul>
                  <div className="locked-overlay">
                    <span className="lock-icon">🔒</span>
                  </div>
                </div>

                <div className="tier-card diamond locked">
                  <div className="tier-badge">
                    <span className="tier-icon">💠</span>
                    <h4>Diamond</h4>
                  </div>
                  <div className="tier-requirement">50,000+ wagered</div>
                  <ul className="tier-benefits">
                    <li>✓ 20% cashback</li>
                    <li>✓ Invitations to VIP trips</li>
                    <li>✓ 24/7 premium support</li>
                    <li>✓ Exclusive high-roller games</li>
                    <li>✓ No withdrawal limits</li>
                    <li>✓ Personalized rewards</li>
                    <li>✓ Red carpet treatment</li>
                  </ul>
                  <div className="locked-overlay">
                    <span className="lock-icon">🔒</span>
                  </div>
                </div>
              </div>

              <div className="exclusive-perks">
                <h4 className="perks-title">
                  <span className="sparkle">✨</span>
                  Your Gold Member Exclusive Perks
                  <span className="sparkle">✨</span>
                </h4>
                
                <div className="perks-grid">
                  <div className="perk-card">
                    <div className="perk-icon">🎁</div>
                    <h5>Monthly Bonus</h5>
                    <p>Receive 500 bonus credits every month</p>
                    <button className="claim-btn">Claim Now</button>
                  </div>

                  <div className="perk-card">
                    <div className="perk-icon">🎰</div>
                    <h5>Free Spins</h5>
                    <p>50 free spins on premium slots weekly</p>
                    <button className="claim-btn">Claim Now</button>
                  </div>

                  <div className="perk-card">
                    <div className="perk-icon">🏆</div>
                    <h5>VIP Tournament</h5>
                    <p>Access to exclusive high-stakes tournaments</p>
                    <button className="claim-btn disabled" disabled>Coming Soon</button>
                  </div>

                  <div className="perk-card">
                    <div className="perk-icon">💰</div>
                    <h5>Cashback Boost</h5>
                    <p>10% cashback on all losses this week</p>
                    <div className="perk-status">Active</div>
                  </div>
                </div>
              </div>

              {/* VIP Lounge CTA */}
              <div className="vip-lounge-cta">
                <div className="cta-content">
                  <h3>🌟 Want More Exclusive Benefits?</h3>
                  <p>Upgrade to Platinum and unlock premium rewards, personal manager, and VIP events</p>
                  <button className="upgrade-btn">
                    <span>View Upgrade Path</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
                <div className="cta-decoration"></div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="content-section">
            <h3>Account Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={`${user.firstName} ${user.lastName}`} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={`@${user.username}`} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={user.email || "user@example.com"} readOnly />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  value={user.country && user.country !== 'unknown' ? user.country : 'Not specified'} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Add phone number" />
              </div>
              <div className="form-group">
                <label>Notification Preferences</label>
                <div className="checkboxes">
                  <label><input type="checkbox" checked={notificationsPrefs.bonusOffers} onChange={() => handleNotificationChange('bonusOffers')}/> Bonus Offers</label>
                  <label><input type="checkbox" checked={notificationsPrefs.gameUpdates} onChange={() => handleNotificationChange('gameUpdates')}/> Game Updates</label>
                  <label><input type="checkbox" checked={notificationsPrefs.vipEvents} onChange={() => handleNotificationChange('vipEvents')}/> VIP Events</label>
                </div>
              </div>
              <button className="save-button" disabled={isSaving} onClick={handleSaveNotifications}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
              {noChangesMessage && (
                <p style={{ 
                  color: '#ff9800', 
                  marginTop: '10px', 
                  fontSize: '14px', 
                }}>
                  {noChangesMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'blocked-users' && (
          <BlockedSection/>
        )}
      </div>

        <div className="credits-sidebar">
          <div className="credits-card">
            <h3>💰 Buy Credits</h3>
            <p className="credits-subtitle">Instant deposit • Best value</p>
            
            <div className="credit-packages">
              {creditPackages.map((pkg, index) => (
                <div 
                  key={index}
                  className={`credit-package ${pkg.popular ? 'popular' : ''} ${isHovered && pkg.popular ? 'pulse' : ''}`}
                  onMouseEnter={() => pkg.popular && setIsHovered(true)}
                  onMouseLeave={() => pkg.popular && setIsHovered(false)}
                >
                  {pkg.popular && <div className="popular-badge">MOST POPULAR</div>}
                  <div className="package-content">
                    <div className="credits-amount">{pkg.credits.toLocaleString()} credits</div>
                    <div className="price">
                      ${pkg.price}
                      {pkg.originalPrice && <s>${pkg.originalPrice}</s>}
                    </div>
                    <button className="buy-button">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="current-balance">
              <h4>Current Balance</h4>
              <div className="balance-amount">{user.totalCredits} credits</div>
              <button className="quick-deposit">Quick Deposit +</button>
            </div>
          </div>

          <div className="promotions-card">
            <h4>🎁 Active Promotions</h4>
            <div className="promotion-item">
              <strong>Welcome Bonus</strong>
              <p>Get 100% bonus on first deposit</p>
            </div>
            <div className="promotion-item">
              <strong>Weekly Free Spins</strong>
              <p>Claim 10 free spins every Monday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;