import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/userContext';

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
    return <div>Loading...</div>;
  }

  return (
    <div className='dashboard-wrapper'>
      <div className="left-section">
        <div className="profile-image-wrapper">
          <img src="../../src/assets/images/user.png" alt="" />
          <div className="change-pic-button">+</div>
        </div>
        <div className="name-details">
          <h3>{user.name}</h3>
        </div>
      </div>

      <div className="mid-section"></div>

      <div className="right-section"></div>
    </div>
  );
};

export default Dashboard;
