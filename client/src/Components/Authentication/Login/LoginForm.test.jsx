import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { renderWithProviders } from '../../../utils/testUtils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../Oauth/LoginGoogleBtn', () => ({
  default: () => <div>Google Login Button</div>
}));

describe('LoginForm', () => {
  const mockHandleClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login to play/i })).toBeInTheDocument();
  });

  it('renders welcome message and bonus offer', () => {
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/get 1000 free chips/i)).toBeInTheDocument();
  });

  it('updates input values when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows validation error for empty username', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const submitButton = screen.getByRole('button', { name: /login to play/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short username', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    await user.type(usernameInput, 'ab'); // Too short

    const submitButton = screen.getByRole('button', { name: /login to play/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    await user.type(usernameInput, 'testuser');

    const submitButton = screen.getByRole('button', { name: /login to play/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, '12345'); // Too short

    const submitButton = screen.getByRole('button', { name: /login to play/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /login to play/i });
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    }, { timeout: 100 });
  });

  it('shows register link', () => {
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/join the casino now/i)).toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => 
      btn.querySelector('svg[data-icon="xmark"]')
    );

    await user.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('renders Google login button', () => {
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    expect(screen.getByText(/google login button/i)).toBeInTheDocument();
  });

  it('shows both validation errors when both fields are empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm handleClose={mockHandleClose} />);

    const submitButton = screen.getByRole('button', { name: /login to play/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});