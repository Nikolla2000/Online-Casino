import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import authReducer from '../redux/features/auth/authSlice';
import aiChatbotReducer from '../redux/features/aiChatbot/aiChatbotSlice';
import authModalsReducer from '../redux/features/auth/authModalsSlice';
import chatReducer from '../redux/features/chat/chatSlice.js';
import rouletteReducer from '../redux/features/roulette/rouletteSlice.js';
import slotsReducer from "../redux/features/slots/slotMachineSlice.js";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Creates a QueryClient instance configured for testing.
 * Disables retries and caching for predictable test behavior.
 * 
 * @returns {QueryClient} Configured QueryClient instance
 */
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Wraps React component with the necessary providers (Redux, React-Router) for testing.
 * 
 * @param {React.ReactElement} component - The component to be rendered for testing.
 * @param {Object} [initialState={}] - Optional initial state to seed the Redux store.
 * @returns {Object} An object containing the standard RTL render results and the created store instance.
 * @property {Object} store - The Redux store instance used for the test (for store.getState() assertions).
 */
export const renderWithProviders = (component, initialState = {}, queryClient = null) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            authModals: authModalsReducer,
            aiChatbot: aiChatbotReducer,
            chat: chatReducer,
            roulette: rouletteReducer,
            slotMachine: slotsReducer,
        },
        preloadedState: initialState
    });

    const testQueryClient = queryClient || createTestQueryClient();
    
    return {
        store,
        queryClient: testQueryClient,
        ...render(
            <Provider store={store}>
                <QueryClientProvider client={testQueryClient}>
                    <BrowserRouter>
                        {component}
                        <Toaster/>
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        )
    }
}

/**
 * Mocks useQuery hook for testing.
 * 
 * @param {any} data - Query data
 * @param {boolean} [isLoading=false] - Loading state
 * @param {boolean} [isError=false] - Error state
 * @returns {Object} Mock query object
 */
export const mockUseQuery = (data, isLoading = false, isError = false) => {
    return {
        data,
        isLoading,
        isError,
        error: isError ? new Error('Test error') : null,
        refetch: vi.fn(),
    };
};

/**
 * Mocks useMutation hook for testing.
 * 
 * @returns {Object} Mock mutation object with vi.fn() methods
 */
export const mockUseMutation = () => {
    return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isLoading: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
        reset: vi.fn(),
    };
};