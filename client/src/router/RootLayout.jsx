import React from 'react';
import { useNavigation, Outlet } from 'react-router';
import Navigation from '../Components/Layout/Navigation/Navigation';
import { Toaster } from 'react-hot-toast'

const RootLayout = () => {
  const navigation = useNavigation();
  return (
    <>
      <Navigation />
      <Toaster position='bottom-right' toastOptions={{  duration: 2000 }}/>
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