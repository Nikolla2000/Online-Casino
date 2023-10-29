import React, { useContext } from 'react';
import { UserContext } from '../../../../context/userContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>
      {user && (
        <div className="bg-gray-100 rounded p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Welcome, {user.firstName}!</h2>
          <p>Email: {user.email}</p>
          {/* More user info */}
        </div>
      )}
      <div className="flex space-x-4">
        <div className="w-1/2 bg-white rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Stats</h3>
          {/* User stats */}
        </div>
        <div className="w-1/2 bg-white rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          {/* functionality or actions for the user */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
