import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import BlockedUser from '../BlockedUser';
import { renderWithProviders } from '../../../../utils/testUtils';

const mockedNavigate = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => mockedNavigate };
});

describe('BlockedUser Component', () => {
    const mockUser = {
        _id: '123',
        username: 'mitko_mitkov',
        firstName: 'Mitko',
        lastName: 'Mitkov',
        profileImage: '/images/user.png',
        createdAt: '2023-10-01T10:00:00Z'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user information correctly', () => {
        renderWithProviders(<BlockedUser blockedUser={mockUser} />);

        expect(screen.getByText('Mitko Mitkov')).toBeInTheDocument();
        expect(screen.getByText('@mitko_mitkov')).toBeInTheDocument();
        expect(screen.getByText(/Blocked on/i)).toBeInTheDocument();
    });

    it('renders fallback username when first/last names are missing', () => {
        const userWithoutNames = { ...mockUser, firstName: null, lastName: null };
        renderWithProviders(<BlockedUser blockedUser={userWithoutNames} />);

        expect(screen.getByText('mitko_mitkov')).toBeInTheDocument();
    });

    it('shows avatar placeholder when profile image is default or missing', () => {
        renderWithProviders(<BlockedUser blockedUser={mockUser} />);
        
        expect(screen.getByText('M')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders real image when a custom profile image is provided', () => {
        const userWithImage = { ...mockUser, profileImage: '/uploads/custom.jpg' };
        renderWithProviders(<BlockedUser blockedUser={userWithImage} />);
        
        const img = screen.getByAltText('mitko_mitkov');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining('/uploads/custom.jpg'));
    });

    it('navigates to profile when "View Profile" button is clicked', () => {
        renderWithProviders(<BlockedUser blockedUser={mockUser} />);
        
        const viewBtn = screen.getByTitle(/view profile/i);
        fireEvent.click(viewBtn);

        expect(mockedNavigate).toHaveBeenCalledWith('/profile/123');
    });
})