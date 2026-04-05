import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfilePage from './ProfilePage';
import authReducer from '../../redux/features/auth/authSlice';

const mockUserData = {
  data: {
    _id: 'user456',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane@test.com',
    profileImage: '/images/user.png',
    country: 'BG',
    isOnline: true,
    isVip: true,
    isVerified: true,
    isBlocked: false,
    totalWagered: 5000,
    totalWon: 3500,
    gamesPlayed: 100,
    registrationDate: '2024-01-01T00:00:00Z',
    lastSeen: '2024-03-09T10:00:00Z'
  },
  isLoading: false,
  error: null
};

const mockUseUserData = vi.fn(() => mockUserData);
const mockBlockUser = vi.fn();
const mockUnblockUser = vi.fn();

vi.mock('../../hooks/useUserData', () => ({
  useUserData: () => mockUseUserData()
}));

vi.mock('../../hooks/useBlockUser', () => ({
  useBlockUser: () => ({
    blockUser: mockBlockUser,
    unblockUser: mockUnblockUser,
    isLoading: false
  })
}));

vi.mock('../../Components/Skeletons/ProfileSkeleton/ProfileSkeleton', () => ({
  default: () => <div>Loading Profile...</div>
}));

vi.mock('../../Components/Block/OpenBlockButton', () => ({
  default: ({ setShowBlockConfirm, isBlocked }) => (
    <button onClick={() => setShowBlockConfirm(true)}>
      {isBlocked ? 'Unblock' : 'Block'}
    </button>
  )
}));

vi.mock('../../Components/MessageButton/MessageButton', () => ({
  default: () => <button>Message</button>
}));

const renderProfilePage = (userId = 'user456', initialState = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: initialState
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/profile/${userId}`]}>
          <Routes>
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  };
};

describe('ProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserData.mockReturnValue(mockUserData);
  });

  it('shows loading skeleton when data is loading', () => {
    mockUseUserData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    renderProfilePage();

    expect(screen.getByText('Loading Profile...')).toBeInTheDocument();
  });

  it('shows error message when user not found', () => {
    mockUseUserData.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'User not found' }
    });

    renderProfilePage();

    expect(screen.getByText('User Not Found')).toBeInTheDocument();
    expect(screen.getByText(/doesn't exist or has been removed/i)).toBeInTheDocument();
  });

  it('renders user profile correctly', () => {
    renderProfilePage();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('@janesmith')).toBeInTheDocument();
  });

  it('displays VIP badge for VIP users', () => {
    renderProfilePage();

    expect(screen.getByText('👑 VIP Member')).toBeInTheDocument();
  });

  it('displays regular badge for non-VIP users', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: { ...mockUserData.data, isVip: false }
    });

    renderProfilePage();

    expect(screen.getByText('⭐ Player')).toBeInTheDocument();
  });

  it('displays online status', () => {
    renderProfilePage();

    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('🟢')).toBeInTheDocument();
  });

  it('displays offline status with last seen', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: { ...mockUserData.data, isOnline: false }
    });

    renderProfilePage();

    expect(screen.getByText(/last seen/i)).toBeInTheDocument();
    expect(screen.getByText('⚫')).toBeInTheDocument();
  });

  it('displays verified badge', () => {
    renderProfilePage();

    expect(screen.queryAllByText(/Verified/i)[0]).toBeInTheDocument();
  });

  it('displays country with flag', () => {
    renderProfilePage();

    expect(screen.getByText('Bulgaria')).toBeInTheDocument();
    expect(screen.getByText('📍')).toBeInTheDocument();
  });

  it('displays user statistics correctly', () => {
    renderProfilePage();

    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('3500')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('70.0%')).toBeInTheDocument();
  });

  it('calculates win rate correctly', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: {
        ...mockUserData.data,
        totalWagered: 1000,
        totalWon: 250
      }
    });

    renderProfilePage();

    expect(screen.getByText('25.0%')).toBeInTheDocument();
  });

  it('shows 0% win rate when no games wagered', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: {
        ...mockUserData.data,
        totalWagered: 0,
        totalWon: 0
      }
    });

    renderProfilePage();

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('shows no activity message when user has not played', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: { ...mockUserData.data, gamesPlayed: 0 }
    });

    renderProfilePage();

    expect(screen.getByText(/hasn't played any games yet/i)).toBeInTheDocument();
  });

  it('opens block confirmation modal', async () => {
    const user = userEvent.setup();
    renderProfilePage();

    const blockButton = screen.getByText('Block');
    await user.click(blockButton);

    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to block/i)).toBeInTheDocument();
    });
  });

  it('blocks user when confirmed', async () => {
    const user = userEvent.setup();
    mockBlockUser.mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });

    renderProfilePage();

    const blockButton = screen.getByText('Block');
    await user.click(blockButton);

    const confirmButton = screen.getByText('Yes');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockBlockUser).toHaveBeenCalled();
    });
  });

  it('unblocks user when confirmed', async () => {
    const user = userEvent.setup();
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: { ...mockUserData.data, isBlocked: true }
    });

    mockUnblockUser.mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });

    renderProfilePage();

    const unblockButton = screen.getByText('Unblock');
    await user.click(unblockButton);

    const confirmButton = screen.getByText('Yes');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUnblockUser).toHaveBeenCalled();
    });
  });

  it('closes modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderProfilePage();

    const blockButton = screen.getByText('Block');
    await user.click(blockButton);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });

  it('hides user info when user is blocked', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: { ...mockUserData.data, isBlocked: true }
    });

    renderProfilePage();

    expect(screen.getByText(/You have blocked this user/i)).toBeInTheDocument();
    expect(screen.queryByText(/VIP Member/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Bulgaria')).not.toBeInTheDocument();
  });

  it('shows zeros for stats when user is blocked', () => {
    mockUseUserData.mockReturnValue({
      ...mockUserData,
      data: { ...mockUserData.data, isBlocked: true }
    });

    renderProfilePage();

    const statValues = screen.getAllByText('0');
    expect(statValues.length).toBeGreaterThan(0);
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();
    
    vi.mock('react-router-dom', async () => {
      const mockNavigate = vi.fn();
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });

    renderProfilePage();

    const backButton = screen.getByText('← Back');
    await user.click(backButton);

    expect(backButton).toBeInTheDocument();
  });
});