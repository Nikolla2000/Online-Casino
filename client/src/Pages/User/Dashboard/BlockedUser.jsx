import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './DashboardSections/BlockedSectionStyles.scss';
import { formatDate, formatTimeAgo } from "../../../utils/timeFormatter";

const apiURL = import.meta.env.VITE_ENV !== 'production' 
  ? import.meta.env.VITE_LOCAL_SERVER_URL 
  : import.meta.env.VITE_PRODUCTION_SERVER_URL;

const BlockedUser = ({ blockedUser }) => {
    const navigate = useNavigate();
    console.log(blockedUser)

    const handleViewProfile = () => {
        navigate(`/profile/${blockedUser._id}`)
    }

    const handleUnblock = () => {}

    return (
        <div className="blocked-user-card">
        <div className="blocked-user-info">
          <div className="user-avatar-wrapper">
            {blockedUser.profileImage && blockedUser.profileImage !== "/images/user.png" ? (
              <img 
                src={new URL(blockedUser.profileImage, apiURL).href} 
                alt={blockedUser.username || 'User'}
                className="user-avatar"
              />
            ) : (
              <div className="avatar-placeholder">
                {blockedUser.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="blocked-overlay"></div>
          </div>
  
          <div className="user-details">
            <div className="user-name-row">
              <h4 className="user-name">
                {blockedUser.firstName && blockedUser.lastName 
                  ? `${blockedUser.firstName} ${blockedUser.lastName}`
                  : blockedUser.username || 'Unknown User'}
              </h4>
              {/* {blockedUser.isVerified && (
                <FontAwesomeIcon icon={faCheckCircle} className="verified-icon" title="Verified" />
              )} */}
            </div>
            <p className="user-username">@{blockedUser.username || 'unknown'}</p>
            {blockedUser.createdAt && (
              <p className="blocked-time">
                Blocked on {formatDate(blockedUser.createdAt)}
              </p>
            )}
          </div>
        </div>
  
        <div className="blocked-user-actions">
          <button 
            className="action-btn view-profile-btn"
            onClick={handleViewProfile}
            title="View profile"
          >
            <FontAwesomeIcon icon={faUser} />
            {/* <span>View Profile</span> */}
          </button>
          
          {/* <button 
            className="action-btn unblock-btn"
            onClick={handleUnblock}
            disabled={isUnblocking}
            title="Unblock user"
          >
            {isUnblocking ? (
              <span>Unblocking...</span>
            ) : (
              <>
                <span>✓</span>
                <span>Unblock</span>
              </>
            )}
          </button> */}
        </div>
      </div>
    )

}

export default BlockedUser;