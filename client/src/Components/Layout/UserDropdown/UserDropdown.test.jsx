import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDropdown from './UserDropdown';
import { renderWithProviders } from '../../../utils/testUtils';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockedNavigate };
});

describe('UserDropdown', () => {
  const mockSetShowDropdown = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login and register options for guests', () => {
    renderWithProviders(<UserDropdown show={true} setShowDropdown={mockSetShowDropdown} />, {
      auth: { user: null, accessToken: null }
    });

    expect(screen.getByText(/welcome, guest/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/1000 FREE CHIPS/i)).toBeInTheDocument();
  });

  it('renders profile and wallet options for authenticated users', () => {
    const mockUser = { firstName: 'Ivan', totalCredits: 5000, isVip: true };
    
    renderWithProviders(<UserDropdown show={true} setShowDropdown={mockSetShowDropdown} />, {
      auth: { user: mockUser, accessToken: 'token' }
    });

    expect(screen.getByText(/welcome, ivan/i)).toBeInTheDocument();
    // expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText(/5.?000/)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.getByText(/vip member/i)).toBeInTheDocument();
  });

  it('dispatches showLogin and closes dropdown when login is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <UserDropdown show={true} setShowDropdown={mockSetShowDropdown} />
    );

    await user.click(screen.getByText(/login/i));

    expect(store.getState().authModals.showLoginModal).toBe(true);
    expect(mockSetShowDropdown).toHaveBeenCalledWith(false);
  });

  it('navigates to correct path and closes dropdown on menu item click', async () => {
    const user = userEvent.setup();
    const mockUser = { firstName: 'Ivan' };

    renderWithProviders(<UserDropdown show={true} setShowDropdown={mockSetShowDropdown} />, {
      auth: { user: mockUser, accessToken: 'token' }
    });

    await user.click(screen.getByText(/profile/i));

    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard?section=stats');
    expect(mockSetShowDropdown).toHaveBeenCalledWith(false);
  });

  it('dispatches logout action and handles redirect', async () => {
    const user = userEvent.setup();
  
    delete window.location;
    window.location = { href: '' };
  
    const { store } = renderWithProviders(
      <UserDropdown show={true} setShowDropdown={mockSetShowDropdown} />, 
      { auth: { user: { _id: "someid123", firstName: 'Ivan' }, accessToken: 'token' } }
    );
  
    await user.click(screen.getByText(/logout/i));
    
    await waitFor(() => {
      expect(mockSetShowDropdown).toHaveBeenCalledWith(false);
      expect(window.location.href).toBe('/');
    });
  });

  it('closes dropdown when clicking on the overlay', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
        <UserDropdown show={true} setShowDropdown={mockSetShowDropdown} />
    );

    const overlay = container.querySelector('.dropdown-overlay');
    await user.click(overlay);

    expect(mockSetShowDropdown).toHaveBeenCalledWith(false);
  });
});
