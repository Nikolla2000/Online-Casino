import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import authReducer from '../redux/features/auth/authSlice';
import aiChatbotReducer from '../redux/features/aiChatbot/aiChatbotSlice';
import authModalsReducer from '../redux/features/auth/authModalsSlice'
import { Toaster } from "react-hot-toast";


/**
 * Wraps React component with the necessary providers (Redux, React-Router) for testing.
 * 
 * @param {React.ReactElement} component - The component to be rendered for testing.
 * @param {Object} [initialState={}] - Optional initial state to seed the Redux store.
 * @returns {Object} An object containing the standard RTL render results and the created store instance.
 * @property {Object} store - The Redux store instance used for the test (for store.getState() assertions).
 */
export const renderWithProviders = (component, initialState = {}) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            authModals: authModalsReducer,
            aiChatbot: aiChatbotReducer
        },
        preloadedState: initialState
    });
    
    return {
        store,
        ...render(
            <Provider store={store}>
                <BrowserRouter>
                    {component}
                    <Toaster/>
                </BrowserRouter>
            </Provider>
        )
    }
}