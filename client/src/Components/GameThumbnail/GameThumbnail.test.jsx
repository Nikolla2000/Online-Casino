import { fireEvent, screen } from "@testing-library/react";
import GameThumbnail from "./GameThumbnail";
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from "../../utils/testUtils";

const mockGame = {
    id: '1',
    gameName: 'Slots',
    linkPath: '/games/slots',
    image: '/images/slot-thumbnail-bg.mp4',
};

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async() => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockedNavigate }
});

describe('GameThumbnail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders game details correctly', () => {
        renderWithProviders(<GameThumbnail data={mockGame} index={0}/>)

        expect(screen.getByRole('heading', { level: 3, name: /slots/i })).toBeInTheDocument();
        expect(screen.getByText(/PLAY NOW/i)).toBeInTheDocument();
    });

    it('redirects to game on click if user is authenticated', async() => {
        const user = userEvent.setup();
        
        renderWithProviders(<GameThumbnail data={mockGame} index={0}/>, {
            auth: { user: { id: '1' }, accessToken: 'valid-token' }
        });

        const card = screen.getByRole('heading', { level: 3, name: /slots/i }).closest('.game-card');
        await user.click(card);

        expect(mockedNavigate).toHaveBeenCalledWith('/games/slots');
    });

    it('shows login modal on click if user is not authenticated', async() => {
        const user = userEvent.setup();

        // const { store } = renderWithProviders(
        //     <GameThumbnail data={mockGame} index={0}/>, {
        //         auth: { user: null, accessToken: null },
        //         authModals: { showLoginModal: false }
        //     }
        // );

        // const store = configureStore({
        //     reducer: { auth: authReducer, authModals: authModalsReducer }
        // });

        // render(
        //     <Provider store={store}>
        //         <GameThumbnail data={mockGame} index={0}/>
        //     </Provider>
        // )

        const { store } = renderWithProviders(<GameThumbnail data={mockGame} index={0}/>)

        const card = screen.getByRole('heading', { level: 3, name: /slots/i }).closest('.game-card');
        await user.click(card);

        const state = store.getState().authModals;
        expect(state.showLoginModal).toBe(true);
        expect(state.isFromGamesPage).toBe(true);
        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it('toggles hover class on mouse enter/leave', () => {
        renderWithProviders( <GameThumbnail data={mockGame} index={0} />);

        const card = screen.getByRole('heading', { level: 3, name: /slots/i }).closest('.game-card');

        fireEvent.mouseEnter(card);
        expect(card).toHaveClass('hovered');

        fireEvent.mouseLeave(card);
        expect(card).not.toHaveClass('hovered');
    });
});