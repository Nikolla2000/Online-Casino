const apiURL = import.meta.env.VITE_ENV !== 'production' 
  ? import.meta.env.VITE_LOCAL_SERVER_URL 
  : import.meta.env.VITE_PRODUCTION_SERVER_URL;

export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: `${apiURL}oauth/callback`,
  authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  scope: 'openid profile email',
};
  
export const GOOGLE_AUTH_URL = `${GOOGLE_CONFIG.authEndpoint}?` + new URLSearchParams({
  client_id: GOOGLE_CONFIG.clientId,
  redirect_uri: GOOGLE_CONFIG.redirectUri,
  response_type: 'code',
  scope: GOOGLE_CONFIG.scope,
  access_type: 'offline',
  prompt: 'consent',
});