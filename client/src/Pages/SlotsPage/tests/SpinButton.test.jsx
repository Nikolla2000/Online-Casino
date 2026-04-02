import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpinButton from '../Gadgets/SpinButton';
import { gameAPI } from '../../../services/api/gameAPI.JS';
import { renderWithProviders } from '../../../utils/testUtils';
import { toast } from 'react-hot-toast';

vi.mock('../../../services/api/gameAPI.JS', () => ({
  gameAPI: { fetchPlaySlotsRound: vi.fn() }
}));

// vi.mock('../../../services/api/gameAPI.JS');

vi.mock('../../../utils/generalActions', () => ({
  playSound: vi.fn(() => ({ pause: vi.fn() })),
  // playSound: vi.fn(),
}));

vi.mock('../../../utils/slotsUtils', () => ({
  generateRandomSlots: vi.fn(() => [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 1, 2, 3]
  ]),
  animateCreditsIncrement: vi.fn(),
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

describe('SpinButton Component', () => {
  const initialState = {
    slotMachine: {
      isSpinning: false,
      autoPlay: false,
      totalCredits: 1000,
      bet: 10,
      slots: [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]],
      soundOn: true
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();

    vi.clearAllTimers();
    // cleanup();
  });

  it('renders spin button and autoplay toggle', () => {
    renderWithProviders(<SpinButton/>);

    expect(screen.getByText(/Spin/i)).toBeInTheDocument();
    expect(screen.getByText(/auto play/i)).toBeInTheDocument();
  });

  it('allow clicking on the spin btn', async () => {
    const user = userEvent.setup({ delay: null });

    gameAPI.fetchPlaySlotsRound.mockResolvedValue({
      data: {
        reels: [
          [7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7]
        ],
        isWin: true,
        balanceAfter: 950,
      }
    });

    const { store } = renderWithProviders(<SpinButton />, initialState);

    const spinBtn = screen.getByText('Spin');
    // await user.click(spinButton);
    act(() => {
        fireEvent.click(spinBtn);
    });

    expect(store.getState().slotMachine.isSpinning).toBe(true);
  });

  it('shows error when not enough credits', async() => {
    const { store } = renderWithProviders(<SpinButton />, {
      slotMachine: {
        ...initialState.slotMachine,
        totalCredits: 5,
        bet: 10,
      }
    });

    // const spinBtn = screen.getByText('Spin');
    const spinBtn = screen.getByRole('button', { name: /spin/i });

    act(() => {
        fireEvent.click(spinBtn);
    })

    // await waitFor(() => {
        // expect(true).toBe(true)
        // expect(screen.getByText(/not enough credits/i)).toBeInTheDocument();
        expect(gameAPI.fetchPlaySlotsRound).not.toHaveBeenCalled();
        expect(store.getState().slotMachine.isSpinning).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Not Enough Credits');
    // })
  });

  it('does not spin if its already spinning', async () => {
    renderWithProviders(<SpinButton />, {
      slotMachine: {
        ...initialState.slotMachine,
        isSpinning: true
      }
    });

    const spinBtn = screen.getByRole('button', { name: /spin/i });
    const callsBefore = gameAPI.fetchPlaySlotsRound.mock.calls.length;
    
    act(() => {
        fireEvent.click(spinBtn);
    });
    
    expect(gameAPI.fetchPlaySlotsRound).toHaveBeenCalledTimes(callsBefore);
  });

  it('toggles autoplay when switch is clicked', async () => {    
    const { store } = renderWithProviders(<SpinButton />, {
      slotMachine: {
        autoPlay: false,
      }
    });

    const autoPlaySwitch = screen.getByRole('checkbox');
    act(() => {
      fireEvent.click(autoPlaySwitch);
    });

    expect(store.getState().slotMachine.autoPlay).toBe(true);
  });

  it('deducts bet from credits when spinning', async () => {
    gameAPI.fetchPlaySlotsRound.mockResolvedValue({
      data: {
        reels: [
          [7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7],
          [7, 7, 7, 7, 7]
        ],
        isWin: false,
        balanceAfter: 950,
      }
    });

    const { store } = renderWithProviders(<SpinButton />, {
      slotMachine: {
        totalCredits: 1000,
        bet: 50,
        isSpinning: false,
      }
    });

    const spinBtn = screen.getByText('Spin');

    act(() => {
      fireEvent.click(spinBtn);
    })

    expect(store.getState().slotMachine.totalCredits).toBe(950);
  });

  it('calls game API with correct bet amount', async () => {
    const user = userEvent.setup({ delay: null });
    
    gameAPI.fetchPlaySlotsRound.mockResolvedValue({
      data: {
        reels: [
          [1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10],
          [11, 12, 1, 2, 3]
        ],
        isWin: false,
        balanceAfter: 900,
      }
    });

    renderWithProviders(<SpinButton />, {
      slotMachine: {
        totalCredits: 1000,
        bet: 100,
        isSpinning: false,
      }
    });

    const spinBtn = screen.getByText('Spin');
    act(() => {
      fireEvent.click(spinBtn);
    })

    expect(gameAPI.fetchPlaySlotsRound).toHaveBeenCalledWith({
      betAmount: 100
    });
  });

  it('updates slots after API response', async () => {
    const user = userEvent.setup({ delay: null });
    
    const winningReels = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 1, 2, 3]
    ];

    gameAPI.fetchPlaySlotsRound.mockResolvedValue({
      data: {
        reels: winningReels,
        isWin: false,
        balanceAfter: 950,
      }
    });

    const { store } = renderWithProviders(<SpinButton />, {
      slotMachine: {
        totalCredits: 1000,
        bet: 50,
        isSpinning: false,
      }
    });

    const spinBtn = screen.getByText('Spin');
    act(() => {
      fireEvent.click(spinBtn);
    })

    vi.advanceTimersByTime(2000);

    // await waitFor(() => {
      expect(store.getState().slotMachine.slots).toEqual(winningReels);
    // });
  });

  // it('sets winning state when player wins', async () => {
  //   gameAPI.fetchPlaySlotsRound.mockResolvedValue({
  //     data: {
  //       reels: [
  //         [7, 7, 7, 7, 7],
  //         [7, 7, 7, 7, 7],
  //         [7, 7, 7, 7, 7]
  //       ],
  //       isWin: true,
  //       winAmount: 100,
  //       winningLines: [0, 1, 2],
  //       balanceBefore: 1000,
  //       balanceAfter: 1050,
  //     }
  //   });

  //   const { store } = renderWithProviders(<SpinButton />, {
  //     slotMachine: {
  //       ...initialState.slotMachine,
  //       totalCredits: 1000,
  //       bet: 50,
  //       isSpinning: false,
  //     }
  //   });

  //   const spinBtn = screen.getByText('Spin');
  //   // await user.click(spinButton);
  //   act(() => {
  //     fireEvent.click(spinBtn);
  //   })

  //   vi.advanceTimersByTime(2000);

  //   // await waitFor(() => {
  //     // expect(store.getState().slotMachine.isWinning).toBe(true);
  //     expect(store.getState().slotMachine.lastWinAmount).toBe(100);
  //     expect(store.getState().slotMachine.winningLines).toEqual([0, 1, 2]);
  //   // });
  // })

  it('renders autoplay switch as unchecked by default', () => {
    renderWithProviders(<SpinButton />, {
      slotMachine: {
        autoPlay: false,
      }
    });

    const autoPlaySwitch = screen.getByRole('checkbox');
    expect(autoPlaySwitch).not.toBeChecked();
  });

  it('renders autoplay switch as checked when autoplay is on', () => {
    renderWithProviders(<SpinButton />, {
      slotMachine: {
        ...initialState.slotMachine
      }
    });

    const autoPlaySwitch = screen.getByRole('checkbox');

    act(() => {
      fireEvent.click(autoPlaySwitch);
    })

    expect(autoPlaySwitch).toBeChecked();
  });
})