/**
 * Formats a timestamp into a relative "time ago" string.
 * @param {string} timestamp - An ISO 8601 formatted date string.
 * @returns {string} A human-readable relative time string.
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const gameTime = new Date(timestamp);
  const diffMs = now - gameTime;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 60) {
    return 'less than an hour ago';
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
};