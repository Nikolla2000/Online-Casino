import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { renderWithProviders } from '../../../../utils/testUtils';
import { userAPI } from '../../../../services/api/userAPI';
import api from '../../../../axiosConfig';
import { toast } from 'react-hot-toast';

vi.mock('/../../../services/api/userAPI', () => ({
  userAPI: { updatePreferences: vi.fn() }
}));
vi.mock('../../../axiosConfig', () => ({
  default: vi.fn()
}));

vi.mock('../../../hooks/userUserStats', () => ({
  useUserStats: () => ({
    data: { stats: { totalRoundsPlayed: 150 }, favoriteGame: 'slots' },
    isLoading: false,
    error: null
  })
}));

vi.mock('../../../hooks/useRecentActivity', () => ({
  useRecentActivity: () => ({
    data: [],
    isLoading: false,
    error: null
  })
}));

vi.mock('../../../hooks/useGameHistory', () => ({
  useGameHistory: () => ({
    data: null,
    isLoading: false,
    error: null
  })
}));

vi.mock('./DashboardSections/BlockedSection', () => ({
  default: () => <div>Blocked Users Section</div>
}));

vi.mock('../../../Components/Spinner/Spinner', () => ({
  default: () => <div>Loading...</div>,
  LoadingSpinnerSmall: () => <div>Loading small...</div>
}));

vi.mock('../../../Components/Pagination/Pagination', () => ({
  default: () => <div>Pagination</div>
}));

vi.mock('react-hot-toast', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

const mockUser = {
  _id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
  country: 'BG',
  profileImage: '/images/user.png',
  totalCredits: 5000,
  totalWagered: 10000,
  totalWon: 8000,
  isVip: false,
  registrationDate: '2024-01-01',
  bonusOffers: false,
  gameUpdates: true,
  vipEvents: false,
  accessToken: 'sometoken123'
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with user information', () => {
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText(/member since 2024/i)).toBeInTheDocument();
  });

  it('displays VIP status badge', () => {
    renderWithProviders(<Dashboard />, {
      auth: { user: { ...mockUser, isVip: true } }
    });

    expect(screen.getByText('VIP Member')).toBeInTheDocument();
  });

  it('displays regular player badge for non-VIP users', () => {
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    expect(screen.getByText('Regular Player')).toBeInTheDocument();
  });

  it('switches to account settings section', async () => {
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const accountButton = screen.getByText(/account settings/i);

    act(() => {
        fireEvent.click(accountButton);
    });

    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    // expect(screen.getByLabelText(/notification preferences/i)).toBeInTheDocument();
  });

  it('switches to game history section', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const historyButton = screen.getByText(/game history/i);
    await user.click(historyButton);

    expect(screen.getByText('Game History')).toBeInTheDocument();
  });

  it('switches to VIP benefits section', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const vipButton = screen.getByText(/vip benefits/i);
    await user.click(vipButton);

    expect(screen.getByText('VIP Benefits Program')).toBeInTheDocument();
  });

  it('switches to blocked users section', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const blockedButton = screen.getByText(/blocked users/i);
    await user.click(blockedButton);

    expect(screen.getByText('Blocked Users')).toBeInTheDocument();
  });

  // it('validates file type on upload', async () => {
  //   const user = userEvent.setup();
  //   renderWithProviders(<Dashboard />, {
  //     auth: { user: mockUser }
  //   });

  //   const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
  //   // const input = screen.getByRole('button', { name: '+' }).parentElement.querySelector('input[type="file"]');
  //   const input = screen.getByTestId('profile-pic-input');
  //   await user.upload(input, file);
    

  //   await waitFor(() => {
  //     // expect(toast.error).toHaveBeenCalledWith('Please select an image file');
  //     expect(screen.getByText(/please select an image file/i)).toBeInTheDocument();
  //   });
  // });

  it('validates file size on upload', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('profile-pic-input');

    await user.upload(input, largeFile);

    await waitFor(() => {
      expect(screen.getByText(/file size should be less than 5mb/i)).toBeInTheDocument();
    });
  });

  // it('uploads profile picture successfully', async () => {
  //   const user = userEvent.setup();
  //   api.post.mockResolvedValue({
  //     data: { profilePic: '/uploads/new-pic.jpg' }
  //   });

  //   renderWithProviders(<Dashboard />, {
  //     auth: { user: mockUser }
  //   });

  //   const file = new File(['content'], 'profile.jpg', { type: 'image/jpeg' });
  //   const input = screen.getByTestId('profile-pic-input');

  //   await user.upload(input, file);

  //   await waitFor(() => {
  //     expect(screen.getByText(/profile picture updated successfully/i)).toBeInTheDocument();
  //   });
  // });

  it('toggles notification preferences', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const accountButton = screen.getByText(/account settings/i);

    act(() => {
      fireEvent.click(accountButton);
    });

    const bonusCheckbox = screen.getByLabelText(/bonus offers/i);
    expect(bonusCheckbox).not.toBeChecked();

    await user.click(bonusCheckbox);
    expect(bonusCheckbox).toBeChecked();
  });

  it('shows message when saving preferences without changes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />, {
      auth: { user: mockUser }
    });

    const accountButton = screen.getByText(/account settings/i);
    await user.click(accountButton);

    const saveButton = screen.getByText(/save changes/i);

    act(() => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/no changes were made/i)).toBeInTheDocument();
    });
  });

  // it('saves notification preferences successfully', async () => {
  //   const user = userEvent.setup();
  //   userAPI.updatePreferences.mockResolvedValue({});

  //   renderWithProviders(<Dashboard />, {
  //     auth: { user: mockUser }
  //   });

  //   const accountButton = screen.getByText(/account settings/i);
  //   // await user.click(accountButton);
  //   act(() => {
  //     fireEvent.click(accountButton);
  //   });

  //   const bonusCheckbox = screen.getByLabelText(/bonus offers/i);
  //   // await user.click(bonusCheckbox);
  //   act(() => {
  //     fireEvent.click(bonusCheckbox);
  //   });

  //   const saveButton = screen.getByText(/save changes/i);
  //   // await user.click(saveButton);
  //   act(() => {
  //     fireEvent.click(saveButton);
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText(/fields updated successfully/i)).toBeInTheDocument();
  //     expect(userAPI.updatePreferences).toHaveBeenCalledWith({
  //       bonusOffers: true
  //     });
  //   });
  // });

  // it('displays user statistics correctly', () => {
  //   renderWithProviders(<Dashboard />, {
  //     auth: { user: mockUser }
  //   });

  //   expect(screen.getByText('10,000')).toBeInTheDocument();
  //   // expect(screen.getByText('8000')).toBeInTheDocument();
  //   // expect(screen.getByText('150')).toBeInTheDocument();
  // });

  // it('calls logout when logout button is clicked', async () => {
  //   const user = userEvent.setup();
  //   const { store } = renderWithProviders(<Dashboard />, {
  //     auth: { user: mockUser }
  //   });

  //   const logoutButton = screen.getByText('Logout');
  //   await user.click(logoutButton);    

  //   await waitFor(() => {
  //     expect(logoutButton).toBeInTheDocument();
  //   });
  // });
});