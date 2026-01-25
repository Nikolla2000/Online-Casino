import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import './RegisterStyles.scss';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser, login } from '../../../redux/features/auth/authSlice';
import { hideModals } from '../../../redux/features/auth/authModalsSlice';
import { countries } from '../../../utils/countries';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import validateRegisterForm from '../../../utils/validateRegisterForm';
import { 
  faUser, 
  faEnvelope, 
  faGlobe, 
  faLock, 
  faXmark,
  faCrown,
  faIdCard
} from "@fortawesome/free-solid-svg-icons";
import api from '../../../axiosConfig';

const RegisterForm = ({ handleClose, setShowDropdown }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    password: '',
    confirm_password: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessages({});

    const errors = validateRegisterForm(formData);

    if (Object.keys(errors).length === 0) {
      try {
        await api.post('/v2/users/register', formData);
        const loginCredentials = {
          username: formData.username,
          password: formData.password
        };

        const name = formData.firstName;

        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          country: '',
          password: '',
          confirm_password: '',
        });

        toast.success(`Welcome to Elite Casino, ${name}! 🎰`);
        
        const res = dispatch(login(loginCredentials));
        
        if (login.fulfilled.match(res)) {
          const token = res.payload.accessToken;
          dispatch(fetchCurrentUser(token));
          dispatch(hideModals());

          if (setShowDropdown) setShowDropdown(false);

          setTimeout(() => navigate("/"), 400);
        } else {
          toast.error("Error signing in.");
        }
        
      } catch (error) {
        console.error('Registration error:', error);

        if (error.response?.status === 409) {
          setErrorMessages({ duplicate: 'User with this username or email already exists' });
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    } else {
      setErrorMessages(errors);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="register-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Box className="register-modal-container">
        <div className="register-modal-header">
          <div className="register-icon">
            <FontAwesomeIcon icon={faCrown} />
          </div>
          <h2 className="register-title">Join Elite Casino</h2>
          <p className="register-subtitle">Create your account and claim your bonus!</p>
          <button className="close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="input-group">
              <div className={`input-icon ${errorMessages.firstName && 'center-input-icon'}`}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={errorMessages.firstName ? 'error' : ''}
              />
              {errorMessages.firstName && (
                <span className="error-message">{errorMessages.firstName}</span>
              )}
            </div>

            <div className="input-group">
              <div className={`input-icon ${errorMessages.lastName && 'center-input-icon'}`}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={errorMessages.lastName ? 'error' : ''}
              />
              {errorMessages.lastName && (
                <span className="error-message">{errorMessages.lastName}</span>
              )}
            </div>
          </div>

          <div className="input-group">
            <div className={`input-icon ${errorMessages.username && 'center-input-icon'}`}>
              <FontAwesomeIcon icon={faIdCard} />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={errorMessages.username ? 'error' : ''}
            />
            {errorMessages.username && (
              <span className="error-message">{errorMessages.username}</span>
            )}
          </div>

          <div className="input-group">
            <div className={`input-icon ${errorMessages.email && 'center-input-icon'}`}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errorMessages.email && (
              <span className="error-message">{errorMessages.email}</span>
            )}
          </div>

          <div className="input-group country-group">
            <div className={`input-icon ${errorMessages.country && 'center-input-icon'}`}>
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowCountriesDropdown(true);
              }}
              onFocus={() => setShowCountriesDropdown(true)}
              className={errorMessages.country ? 'error' : ''}
            />
            {showCountriesDropdown && (
              <div className="country-dropdown">
                {filteredCountries.map((country) => (
                  <div
                    key={country.value}
                    className="country-option"
                    onClick={() => {
                      setFormData({...formData, country: country.value});
                      setSearchTerm(country.label);
                      setShowCountriesDropdown(false);
                    }}
                  >
                    {country.label}
                  </div>
                ))}
              </div>
            )}
            {errorMessages.country && (
              <span className="error-message">{errorMessages.country}</span>
            )}
          </div>

          <div className="form-row">
            <div className="input-group">
              <div className={`input-icon ${errorMessages.password && 'center-input-icon'}`}>
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errorMessages.password ? 'error' : ''}
              />
              {errorMessages.password && (
                <span className="error-message">{errorMessages.password}</span>
              )}
            </div>

            <div className="input-group">
              <div className={`input-icon ${errorMessages.confirm_password && 'center-input-icon'}`}>
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={errorMessages.confirm_password ? 'error' : ''}
              />
              {errorMessages.confirm_password && (
                <span className="error-message">{errorMessages.confirm_password}</span>
              )}
            </div>
          </div>

          {errorMessages.duplicate && (
            <div className="error-message duplicate-error">
              {errorMessages.duplicate}
            </div>
          )}

          <button 
            type="submit" 
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner"></div>
            ) : (
              'CREATE ACCOUNT & CLAIM BONUS'
            )}
          </button>
        </form>

        <div className="bonus-section">
          <div className="bonus-card">
            <div className="bonus-icon">🎰</div>
            <div className="bonus-content">
              <h3>WELCOME BONUS</h3>
              <p>1000 FREE CHIPS</p>
              <small>Instant credit upon registration!</small>
            </div>
          </div>
        </div>

        <div className="modal-glitter"></div>
        <div className="modal-shine"></div>
      </Box>
    </Modal>
  );
};

export default RegisterForm;