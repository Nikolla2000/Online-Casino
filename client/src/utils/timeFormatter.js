/**
 * Formats a timestamp into a relative "time ago" string.
 * 
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

/**
 * Formats an ISO 8601 timestamp into a human-readable date and time string.
 * 
 * @param {string} timestamp - An ISO 8601 formatted date string.
 * @returns {string} A localized string containing the short month, numeric day, full year, and 2-digit time.
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};