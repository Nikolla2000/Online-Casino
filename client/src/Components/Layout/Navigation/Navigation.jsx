import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faBars, 
  faTimes, 
  faCrown, 
  faCoins,
  faDiamond,
  faGem
} from "@fortawesome/free-solid-svg-icons";
import routes from '../../../utils/routes';
import './NavigationStyles.scss';
import UserDropdown from '../UserDropdown/UserDropdown';
import { useSelector } from 'react-redux';
import LiveUsersPanel from '../../LiveUsersPanel/LiveUsersPanel';

const Navigation = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [showLiveUsers, setShowLiveUsers] = useState(false);
  
  const { user, accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const handleUserIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const getNavIcon = (routeName) => {
    switch(routeName.toLowerCase()) {
      case 'home': return faCrown;
      case 'games': return faDiamond;
      case 'promotions': return faCoins;
      case 'vip': return faGem;
      default: return null;
    }
  };

  return (
    <>
    <nav className={`casino-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <NavLink to="/" className="logo-link">
            <span className="logo-icon">♠️</span>
            <span className="logo-text">ELITE<span className="logo-accent">CASINO</span></span>
          </NavLink>
        </div>

        <div className="nav-desktop">
          <div className="nav-links">
            {Object.values(routes)
              .filter((element) => element.includeInNav)
              .map((element, index) => (
                <NavLink
                  key={index}
                  to={element.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onMouseEnter={() => setActiveHover(element.name)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {getNavIcon(element.name) && (
                    <FontAwesomeIcon 
                      icon={getNavIcon(element.name)} 
                      className="nav-icon"
                    />
                  )}
                  <span className="nav-text">{element.name}</span>
                  <span className="nav-underline"></span>
                </NavLink>
              ))}
          </div>

          <div className="nav-user-section" ref={dropdownRef}>
            {user && accessToken && (
              <button 
                className="active-users-btn"
                onClick={() => setShowLiveUsers(true)}
              >
                {/* See active users */}
                Live Players
              </button>
            )}
            
            <div 
              className="user-icon-container"
              onClick={handleUserIconClick}
            >
              <div className="user-icon-wrapper">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="user-icon"
                />
                {user && accessToken && (
                  <div className="user-status"></div>
                )}
              </div>
              
              {showDropdown && (
                <UserDropdown 
                  show={showDropdown}
                  setShowDropdown={setShowDropdown}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mobile-menu-btn">
          <FontAwesomeIcon
            icon={showMobileMenu ? faTimes : faBars}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-icon"
          />
        </div>
      </div>

      <div className={`nav-mobile ${showMobileMenu ? 'show' : ''}`}>
        <div className="mobile-nav-content">
          {Object.values(routes)
            .filter((element) => element.includeInNav)
            .map((element, index) => (
              <NavLink
                key={index}
                to={element.path}
                className={({ isActive }) => 
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setShowMobileMenu(false)}
              >
                {getNavIcon(element.name) && (
                  <FontAwesomeIcon 
                    icon={getNavIcon(element.name)} 
                    className="mobile-nav-icon"
                  />
                )}
                <span>{element.name}</span>
              </NavLink>
            ))}
          
          <div className="mobile-user-section">
            {user && accessToken && (
              <button className="mobile-active-users-btn" onClick={() => setShowLiveUsers(true)}>
                <span className="mobile-pulse-dot"></span>
                Live Players
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="nav-background">
        <div className="nav-glitter"></div>
        <div className="nav-shine"></div>
      </div>
    </nav>

    <LiveUsersPanel 
    isOpen={showLiveUsers}
    onClose={() => setShowLiveUsers(false)}
    />
  </>
  );
};

export default Navigation;