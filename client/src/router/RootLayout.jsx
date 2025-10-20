import React from 'react';
import { useNavigation, Outlet } from 'react-router';
import Navigation from '../Components/Layout/Navigation/Navigation';
import { Toaster } from 'react-hot-toast'
import LiveChatModal from '../Components/LiveChat/LiveChatModal';
import { useSelector } from 'react-redux';
import FloatingChatButton from '../Components/AIChatSupport/FloatingChatButton';

const RootLayout = () => {
  const navigation = useNavigation();
  const { activeChat } = useSelector(state => state.chat);

  return (
    <>
      <Navigation />
      <Toaster position='bottom-right' toastOptions={{  duration: 2000 }}/>
      <main>
        {navigation.state === "loading" && (
          <h2 className="loading-msg">Loading...</h2>
        )}
        <Outlet />
        {activeChat && <LiveChatModal />}
        <FloatingChatButton/>
      </main>
    </>
  );
};

export default RootLayout;