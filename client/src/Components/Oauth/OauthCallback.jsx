import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { GOOGLE_CONFIG } from "../../lib/oauth";
import './OauthStyles.scss';
import api from "../../axiosConfig";

const OauthCallback = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const urlParams = new URLSearchParams(location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');

                if (error) {
                    setStatus('error');
                    setMessage(`Authentication failed: ${error}`);
                    return;
                }

                if (!code) {
                    setStatus('error');
                    setMessage('No authorization code received');
                    return;
                }

                const tokenResponse = await axios.post(GOOGLE_CONFIG.tokenEndpoint, {
                    client_id: GOOGLE_CONFIG.clientId,
                    client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: GOOGLE_CONFIG.redirectUri,
                  });

                  const { access_token, id_token } = tokenResponse.data;

                  const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                      Authorization: `Bearer ${access_token}`,
                    },
                  });

                  console.log(userInfoResponse);

                  await api.post('/auth/oauth', {
                    email: userInfoResponse.data.email,
                    first_name: userInfoResponse.data.given_name,
                    last_name: userInfoResponse.data.family_name,
                    provider: 'google',
                  });
                
            } catch (err) {
                console.error("Oauth callback error: ", err);
                setStatus('error');
                setMessage('Authentication failed. Please try again.');
            }
        }

        handleCallback();
    }, location, navigate);

    return (
        <div className="oauth-wrapper">
          <div className="oauth-callback">
            {status === 'loading' && (
              <>
                <div className="oauth-spinner"></div>
                <h2>Processing login...</h2>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="oauth-success">✓</div>
                <h2>{message}</h2>
                <p>Redirecting...</p>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="oauth-error">✗</div>
                <h2>Login Failed</h2>
                <p>{message}</p>
                <button 
                  className="oauth-button google-button"
                  onClick={() => navigate('/login')}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      );
    };
    
export default OauthCallback;