import React from 'react';
import {  NavLink } from 'react-router-dom'
import routes from '../../../utils/routes';

const Navigation = () => {
  return (
    <nav>
      <div className="nav-wrapper">
        {Object.values(routes)
        .filter((element) => element.includeInNav === true)
        .map((element, index) => (
          <NavLink
            key={index + 1}
            to={element.path}>
            {element.name}  
          </NavLink>
        ))}
      </div>
      
    </nav>
  );
};

export default Navigation;