import React, {useState} from 'react';
import {  NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import routes from '../../../utils/routes';
import './NavigationStyles.scss'
import UserDropdown from '../UserDropdown/UserDropdown';

const Navigation = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false)
  const [playReverseAnimation, setPlayReverseAnimation] = useState(false)

  const handleClick = () => {
    if(!showDropdown) {
      setShowDropdown(true)
      setPlayReverseAnimation(false)
    } else {
      setPlayReverseAnimation(true)
      setTimeout(() => {
      setShowDropdown(false)
    }, 2000)
  }
  }

  return (
    <nav>
      <div className="nav-wrapper">
      <div className={showMobileMenu ? "show-mobile-menu" : "nav-menu"}>
          {Object.values(routes)
          .filter((element) => element.includeInNav === true)
          .map((element, index) => (
            <NavLink
              key={index + 1}
              to={element.path}>
              {element.name}  
            </NavLink>
          ))}
          <div className="user-icon" onClick={handleClick}>
            <FontAwesomeIcon icon={faUser} style={{color: '#fff'}}/>
          </div>
          {showDropdown && <UserDropdown 
                              show={showDropdown}
                              play={playReverseAnimation}/>}
        </div>
      </div>
      <div className="mobile-menu-wrapper">
        <FontAwesomeIcon
          className="mobile-menu-btn"
          icon={faBars}
          onClick={() => {
            setShowMobileMenu(!showMobileMenu)
          }}
        />
      </div>
      
    </nav>
  );
};

export default Navigation;