import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from './Board/Board';
import { renderWithProviders } from '../../utils/testUtils';
import Wheel from './Wheel/Wheel';
// import { gameAPI } from '../../../../services/api/gameAPI.JS';

vi.mock('../../../services/api/gameAPI.JS');

vi.mock('../../../utils/generalActions', () => ({
  playSound: vi.fn(() => ({ pause: vi.fn() })),
  fadeOutAudio: vi.fn(),
}));

vi.mock('../../SlotsPage/Gadgets/CoinRain', () => ({
  default: () => <div>Coin Rain</div>
}));

describe('Roulette tests', () => {
    describe('Board Component', () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });
    
      it('renders the roulette board', () => {
        renderWithProviders(<Board />);
    
        expect(screen.getByText('Place Bet')).toBeInTheDocument();
        expect(screen.getByText('Clear Bet')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument(); // Zero cell
      });
    
      it('displays credits and bet information', () => {
        renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 1000,
            bet: 50,
            betType: 'red',
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        expect(screen.getByText(/1000/i)).toBeInTheDocument();
        expect(screen.getByText(/50/i)).toBeInTheDocument();
        expect(screen.queryAllByText(/red/i)[0]).toBeInTheDocument();
      });
    
      it('allows selecting a number bet', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />);
    
        const number5 = screen.getByText('5');
        await user.click(number5);
    
        const state = store.getState().roulette;
        expect(state.betType).toBe('number');
        expect(state.betValue).toBe(5);
      });
    
      it('allows selecting red bet', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />);
    
        const redBet = screen.getByText('RED');
        await user.click(redBet);
    
        const state = store.getState().roulette;
        expect(state.betType).toBe('red');
      });
    
      it('allows selecting black bet', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />);
    
        const blackBet = screen.getByText('BLACK');
        await user.click(blackBet);
    
        const state = store.getState().roulette;
        expect(state.betType).toBe('black');
      });
    
      it('allows selecting even/odd bets', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />);
    
        const evenBet = screen.getByText('EVEN');
        await user.click(evenBet);
    
        expect(store.getState().roulette.betType).toBe('even');
    
        const oddBet = screen.getByText('ODD');
        await user.click(oddBet);
    
        expect(store.getState().roulette.betType).toBe('odd');
      });
    
      it('increases bet when chip is clicked', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 1000,
            bet: 0,
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        // click 10 chip
        const chip10 = screen.getByAltText('10 chip');
        await user.click(chip10);
    
        expect(store.getState().roulette.bet).toBe(10);
    
        // click 25 chip
        const chip25 = screen.getByAltText('25 chip');
        await user.click(chip25);
    
        expect(store.getState().roulette.bet).toBe(35);
      });
    
      it('does not increase bet beyond available credits', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 20,
            bet: 0,
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        const chip50 = screen.getByAltText('50 chip');
        await user.click(chip50);
    
        await waitFor(() => {
          expect(screen.getByText(/not enough credits/i)).toBeInTheDocument();
        });
      });
    
      it('clears bet when Clear Bet button is clicked', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 1000,
            bet: 50,
            betType: 'red',
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        const clearButton = screen.getByText('Clear Bet');
        await user.click(clearButton);
    
        const state = store.getState().roulette;
        expect(state.bet).toBe(0);
        expect(state.betType).toBe(null);
      });
    
      it('disables Place Bet button when spinning', () => {
        renderWithProviders(<Board />, {
          roulette: {
            isSpinning: true,
            bet: 50,
            betType: 'red',
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        const placeBetButton = screen.getByText('Spinning...');
        expect(placeBetButton).toBeDisabled();
      });
    
      it('shows error when trying to place bet without credits', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 0,
            bet: 50,
            betType: 'red',
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        const placeBetButton = screen.getByText('Place Bet');
        await user.click(placeBetButton);
    
        await waitFor(() => {
          expect(screen.queryAllByText(/not enough credits/i)[0]).toBeInTheDocument();
        });
      });
    
      it('shows error when trying to place bet with 0 bet amount', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 1000,
            bet: 0,
            betType: 'red',
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        const placeBetButton = screen.getByText('Place Bet');
        await user.click(placeBetButton);
    
        await waitFor(() => {
          expect(screen.getByText(/please place a bet/i)).toBeInTheDocument();
        });
      });
    
      it('shows error when trying to place bet without choosing bet type', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 1000,
            bet: 50,
            betType: null,
            lastResults: [
                {
                    randNumber: 17,
                    color: 'red'
                }
            ]
          }
        });
    
        const placeBetButton = screen.getByText('Place Bet');
        await user.click(placeBetButton);
    
        await waitFor(() => {
          expect(screen.getByText(/please choose a betting option/i)).toBeInTheDocument();
        });
      });
    
      it('displays last results', () => {
        renderWithProviders(<Board />, {
          roulette: {
            totalCredits: 1000,
            bet: 50,
            betType: 'red',
            lastResults: [
              { randNumber: 17, color: 'red' },
              { randNumber: 0, color: 'green' },
              { randNumber: 24, color: 'black' },
            ]
          }
        });
    
        expect(screen.queryAllByText(/17/i)[1]).toBeInTheDocument();
        expect(screen.queryAllByText(/0/i)[1]).toBeInTheDocument();
        expect(screen.queryAllByText(/24/i)[1]).toBeInTheDocument();
      });
    
      it('deselects bet option when clicked twice', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Board />);
    
        const redBet = screen.getByText('RED');
        
        // select
        await user.click(redBet);
        expect(store.getState().roulette.betType).toBe('red');
    
        // deselect
        await user.click(redBet);
        expect(store.getState().roulette.betType).toBe(null);
      });
    
      it('renders all chip denominations', () => {
        renderWithProviders(<Board />);
    
        expect(screen.getByAltText('5 chip')).toBeInTheDocument();
        expect(screen.getByAltText('10 chip')).toBeInTheDocument();
        expect(screen.getByAltText('25 chip')).toBeInTheDocument();
        expect(screen.getByAltText('50 chip')).toBeInTheDocument();
        expect(screen.getByAltText('100 chip')).toBeInTheDocument();
      });
    });


    describe('Wheel Component', () => {
        it('should have certain animation classes depending on state', () => {
            const { container } = renderWithProviders(<Wheel/>, {
                roulette: {
                    isWheelSpinning: true,
                    isBallSpinning: true,
                    result: null
                }
            })
            
            const wheelElement = container.firstChild;
            expect(wheelElement).toHaveClass('wheel-animation');
            expect(wheelElement).toHaveClass('ball-spinning');
        });


        it('should not have animation classes if state if false', () => {
            const { container } = renderWithProviders(<Wheel/>, {
                roulette: {
                    isWheelSpinning: false,
                    isBallSpinning: false,
                    result: null
                }
            })
            
            const wheelElement = container.firstChild;
            expect(wheelElement).not.toHaveClass('wheel-animation');
            expect(wheelElement).not.toHaveClass('ball-spinning');
        });
    })
})