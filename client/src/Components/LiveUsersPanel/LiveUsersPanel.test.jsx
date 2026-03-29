import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LiveUsersPanel from './LiveUsersPanel';
import { renderWithProviders } from '../../utils/testUtils';
import { userAPI } from '../../services/api/userAPI';

// 1. Mock на API-то
vi.mock('../../services/api/userAPI', () => ({
  userAPI: {
    fetchOnlineUsers: vi.fn()
  }
}));

// mocking custom usequery hook
const mockUseGetBlockedUsers = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/useGetBlockedUsers', () => ({
  useGetBlockedUsers: mockUseGetBlockedUsers
}));

describe('LiveUsersPanel', () => {
  const mockUsers = [
    { _id: '1', username: 'Gamer123', isOnline: true, profileImage: '/images/user.png' },
    { _id: '2', username: 'ProPlayer', isOnline: true, isVip: true },
    { _id: 'user123', username: 'Me', isOnline: true }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    mockUseGetBlockedUsers.mockReturnValue({ data: [], isLoading: false });
    userAPI.fetchOnlineUsers.mockResolvedValue({ success: true, users: mockUsers });
  });

  it('renders correctly and fetches users when opened', async () => {
    renderWithProviders(<LiveUsersPanel isOpen={true} onClose={vi.fn()} />, {
      auth: { user: { _id: 'user123' }, accessToken: 'valid-token' }
    });

    expect(screen.queryAllByText(/Online Players/i)[0]).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryAllByText('Gamer123')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('ProPlayer')[0]).toBeInTheDocument();
    });
  });

  it('filters users based on search input', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LiveUsersPanel isOpen={true} onClose={vi.fn()} />, {
      auth: { user: { _id: 'user123' }, accessToken: 'valid-token' }
    });

    await waitFor(() => expect(screen.queryByText('Gamer123')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search players.../i);
    await user.type(searchInput, 'Pro');

    expect(screen.getByText('ProPlayer')).toBeInTheDocument();
    expect(screen.queryByText('Gamer123')).not.toBeInTheDocument();
  });

  it('shows blocked status for blocked users', async () => {
    // Gamer123 is blocked
    mockUseGetBlockedUsers.mockReturnValue({ 
      data: [{ blockedId: { _id: '1' } }], 
      isLoading: false 
    });

    renderWithProviders(<LiveUsersPanel isOpen={true} onClose={vi.fn()} />, {
      auth: { user: { _id: 'user123' }, accessToken: 'token' }
    });

    await waitFor(() => {
      const userCard = screen.getByText('Gamer123').closest('.user-card');
      expect(userCard).toHaveClass('is-blocked');
    });
  });

  it('shows empty state when no users match search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LiveUsersPanel isOpen={true} onClose={vi.fn()} />, {
      auth: { user: { _id: 'user123' }, accessToken: 'token' }
    });

    await waitFor(() => expect(screen.queryAllByText('Gamer123')[0]).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Search players.../i);
    await user.type(searchInput, 'NonExistentUser');

    expect(screen.getByText(/No players found/i)).toBeInTheDocument();
  });

  it('shows "You" badge for the current user', async () => {
    renderWithProviders(<LiveUsersPanel isOpen={true} onClose={vi.fn()} />, {
      auth: { user: { _id: 'user123', username: 'Me' }, accessToken: 'token' }
    });

    await waitFor(() => {
      expect(screen.getByText('(You)')).toBeInTheDocument();
    });
  });

  it('calls onClose when clicking the close button or overlay', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    const { container } = renderWithProviders(
      <LiveUsersPanel isOpen={true} onClose={mockOnClose} />
    );

    const closeBtn = container.querySelector('.close-btn');
    await user.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    const overlay = container.querySelector('.panel-overlay');
    await user.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});
