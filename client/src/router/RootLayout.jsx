import React, { useEffect } from 'react';
import { useNavigation, Outlet, useLocation } from 'react-router';
import Navigation from '../Components/Layout/Navigation/Navigation';
import { Toaster } from 'react-hot-toast'
import LiveChatModal from '../Components/LiveChat/LiveChatModal';
import { useDispatch, useSelector } from 'react-redux';
import FloatingChatButton from '../Components/AIChatSupport/FloatingChatButton';
import AIChatWidget from '../Components/AIChatSupport/AIChatWidget';
import { hideChat, toggleChatButton } from '../redux/features/aiChatbot/aiChatbotSlice';

const RootLayout = () => {
  const navigation = useNavigation();
  const { activeChat } = useSelector(state => state.chat);
  const { showAiChatWidget, showChatButton } = useSelector(state => state.aiChatbot);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(hideChat());

    if (location.pathname.includes('/games/')) {
      dispatch(toggleChatButton(false));
    } else {
      dispatch(toggleChatButton(true));
    }
  }, [location.pathname, dispatch]);

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
        {!showAiChatWidget && showChatButton && <FloatingChatButton/>}
        {showAiChatWidget && <AIChatWidget/>}
      </main>
    </>
  );
};

export default RootLayout;