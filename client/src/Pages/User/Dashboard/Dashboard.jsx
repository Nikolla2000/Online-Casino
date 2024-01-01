import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import "./DashboardStyles.scss";
import Stats from './Stats';
import AccountInfo from './AccountInfo';
import axios from '../../../axiosConfig';
import { useNavigate } from 'react-router';
import 'animate.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [midSection, setMidSection] = useState('Stats');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const waitForUser = async () => {
      return !!user.name;
    };

    const fetchData = async () => {
      const userAvailable = await waitForUser();
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <div><CircularProgress color="secondary" /></div>;
  }

  const changeSection = (event) => {
    event.stopPropagation();
    setMidSection(event.target.innerText);
  }

  const logout = async () => {
      try {
        await axios.get('/user/logout');
        navigate('/');
        location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
  };

  return (
    <div className='dashboard-wrapper container'>

      <div className="left-section">
        <div className="profile-image-wrapper">
          <img src="../../src/assets/images/user.png" alt="" />
          <div className="change-pic-button">+</div>
        </div>
        <div className="name-details">
          <h3>{user.name}</h3>
          <h5>Master of the slots</h5>
        </div>
        <div className="profile-nav">
          <p className={`${midSection == "Stats" ? 'current' : ''}`} onClick={changeSection}>Stats</p>
          <p className={`${midSection == "Account Info" ? 'current' : ''}`} onClick={changeSection}>Account Info</p>
          <p onClick={logout}>Logout</p>
        </div>
      </div>

      <div className="mid-section">
        {midSection == 'Stats' ? <Stats/> : <AccountInfo/>}
      </div>

      <div className="right-section">
        <h3>Buy Credits</h3>
        <div 
            className="credits-options" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
          <div className="option">
            <span>1000</span>
            <span>$9.99</span>
          </div>
          <div className="option">
            <span>2000</span>
            <span>$18.99</span>
          </div>
          <div className="option">
            <span>5000</span>
            <span>$45.99</span>
          </div>
          <div className={`option best-option ${isHovered && 'animte__animated animate__heartBeat'}`}>
            <span>10000</span>
            <span>$89.99 <s>$99.99</s></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
