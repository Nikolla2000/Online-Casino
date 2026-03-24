import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import authReducer from '../redux/features/auth/authSlice';
import aiChatbotReducer from '../redux/features/aiChatbot/aiChatbotSlice';
import authModalsReducer from '../redux/features/auth/authModalsSlice'
import { Toaster } from "react-hot-toast";

//Redux wrapper function for testing
export const renderWithProviders = (component, initialState = {}) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            authModals: authModalsReducer,
            aiChatbot: aiChatbotReducer
        },
        preloadedState: initialState
    });
    
    return render(
        <Provider store={store}>
        <BrowserRouter>
            {component}
            <Toaster/>
        </BrowserRouter>
    </Provider>
    );
}