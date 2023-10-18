import React from 'react';
import {  NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import routes from '../../../utils/routes';
import './NavigationStyles.scss'

const Navigation = () => {
  return (
    <nav>
      <div className="nav-wrapper">
        <div className="nav-menu">
          {Object.values(routes)
          .filter((element) => element.includeInNav === true)
          .map((element, index) => (
            <NavLink
              key={index + 1}
              to={element.path}>
              {element.name}  
            </NavLink>
          ))}
          <FontAwesomeIcon icon={faUser} style={{color: '#fff'}}/>
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;