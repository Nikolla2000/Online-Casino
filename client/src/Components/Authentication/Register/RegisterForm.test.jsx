import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import authReducer from '../../../redux/features/auth/authSlice';
import authModalsReducer from '../../../redux/features/auth/authModalsSlice'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RegisterForm from './RegisterForm';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

vi.mock('../../../axiosConfig');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderWithProviders = (component) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
            authModals: authModalsReducer
        }
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

describe('RegisterForm', () => {
    const mockHandleClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('renders all form fields', () => {
        renderWithProviders(<RegisterForm handleClose={mockHandleClose}/>);

        expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/search country/i)).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/password/i)).toHaveLength(2);
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty required fields', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RegisterForm handleClose={mockHandleClose} />);

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/First Name must be between 2 and 20 characters/i)).toBeInTheDocument();
            // expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        });
  });
})