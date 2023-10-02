import React from 'react';
import { useNavigation, Outlet } from 'react-router';
import Navigation from '../Components/Layout/Navigation/Navigation';

const RootLayout = () => {
  const navigation = useNavigation();
  return (
    <>
      <Navigation />
      <main>
        {navigation.state === "loading" && (
          <h2 className="loading-msg">Loading...</h2>
        )}
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;