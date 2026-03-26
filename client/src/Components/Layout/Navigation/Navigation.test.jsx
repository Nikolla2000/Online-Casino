import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../../../utils/testUtils';
import Navigation from './Navigation';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('./NavigationStyles.scss', () => ({}));
vi.mock('/images/background-video4.mp4', () => ({
  default: 'mock-video-file'
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => (
    <span data-testid={`icon-${icon.iconName}`} />
  )
}));


describe('Navigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders logo and main navigation links', () => {
        renderWithProviders(<Navigation/>);

        expect(screen.getByText(/ELITE/i)).toBeInTheDocument();
        expect(screen.getByText(/CASINO/i)).toBeInTheDocument();
        expect(screen.getAllByRole('link', { name: /home/i })[0]).toBeInTheDocument();
    });

    it('does not show Live Players button for guests', () => {
        renderWithProviders(<Navigation/>, {
            auth: { user: null, accessToken: null }
        });

        expect(screen.queryByText(/live players/i)).not.toBeInTheDocument();
    });

    it('shows Live Players button when authenticated', () => {
        renderWithProviders(<Navigation/>, {
            auth: { user: {_id: 'user123'}, accessToken: 'valid-token' }
        });

        expect(screen.getAllByRole('button', { name: /live players/i })[0]).toBeInTheDocument();
    });

    it('opens and closes user dropdown on click', async () => {
        const user = userEvent.setup();

        const { container } = renderWithProviders(<Navigation/>, {
            auth: { user: {_id: 'user123'}, accessToken: 'valid-token' }
        });

        const userIcon = screen.getByTestId('icon-user');
        await user.click(userIcon);

        //if it cant find icon
        // const userIconContainer = container.querySelector('.user-icon-container');
        // await user.click(userIconContainer);

        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it('shows Login form when showLoginModal is true in redux', () => {
        renderWithProviders(<Navigation/>, {
            authModals: { showLoginModal: true }
        });

        expect(screen.getByRole('heading', { name: /welcome back!/i })).toBeInTheDocument();
    });

    it('navigates to correct page when link is clicked in navigation', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Navigation/>);

        const contactLink = screen.getAllByRole('link', { name: /contact/i })[0];
        const gamesLink = screen.getAllByRole('link', { name: /games/i })[0];

        await user.click(contactLink);
        expect(window.location.pathname).toBe('/contact');

        await user.click(gamesLink);
        expect(window.location.pathname).toBe('/games');
    });
});