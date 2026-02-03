import React from 'react';
import './ProfileSkeleton.scss';

const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="profile-skeleton-header">
        <div className="skeleton-shimmer skeleton-avatar"></div>
        <div className="skeleton-info">
          <div className="skeleton-shimmer skeleton-name"></div>
          <div className="skeleton-shimmer skeleton-username"></div>
          <div className="skeleton-shimmer skeleton-badge"></div>
        </div>
      </div>

      <div className="profile-skeleton-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-stat-card">
            <div className="skeleton-shimmer skeleton-stat-icon"></div>
            <div className="skeleton-shimmer skeleton-stat-value"></div>
            <div className="skeleton-shimmer skeleton-stat-label"></div>
          </div>
        ))}
      </div>

      <div className="profile-skeleton-content">
        <div className="skeleton-shimmer skeleton-section-title"></div>
        <div className="skeleton-shimmer skeleton-text-line"></div>
        <div className="skeleton-shimmer skeleton-text-line short"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;