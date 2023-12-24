import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/userContext';
import CircularProgress from '@mui/material/CircularProgress';
import "./DashboardStyles.scss";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

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
          <p className='current'>Stats</p>
          <p>Account Info</p>
          <p>Logout</p>
        </div>
      </div>

      <div className="mid-section">
        <div className="stats">test stats</div>
      </div>

      <div className="right-section"></div>
    </div>
  );
};

export default Dashboard;
