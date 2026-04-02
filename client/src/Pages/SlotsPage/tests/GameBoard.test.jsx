import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/testUtils';
import GameBoard from '../GameBoard/GameBoard';

describe('GameBoard Component', () => {
    
  const mockSlots = [
    [1, 1, 1, 2, 2],
    [3, 3, 3, 3, 3],
    [4, 4, 4, 4, 4]
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the correct number of slot items', () => {
    renderWithProviders(<GameBoard />, {
      slotMachine: { slots: mockSlots, winningLines: [] }
    });

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(15); // 3 rows * 5 columns
  });

  it('highlights the correct cells when there is a winning line', async () => {
    const winningLines = [
      {
        pattern: 'Top Row',
        symbols: [1, 1, 1, 2, 2],
        multiplier: 5
      }
    ];

    const { container } = renderWithProviders(<GameBoard />, {
      slotMachine: { slots: mockSlots, winningLines: winningLines }
    });

    // top row positions - [0,0], [0,1], [0,2], [0,3], [0,4]
    // only first 3 cells should be highlighted (0-0, 0-1, 0-2)
    
    const winningCells = container.querySelectorAll('.winning-cell');
    expect(winningCells).toHaveLength(3);
    
    expect(winningCells[0]).toBeInTheDocument();
    expect(container.querySelector('.win-overlay')).toBeInTheDocument();
  });

  it('clears highlights after 3 seconds', async () => {
    const winningLines = [{ pattern: 'Middle Row', symbols: [3, 3, 3, 3, 3] }];

    const { container } = renderWithProviders(<GameBoard />, {
      slotMachine: { slots: mockSlots, winningLines: winningLines }
    });

    expect(container.querySelectorAll('.winning-cell').length).toBe(5);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(container.querySelectorAll('.winning-cell').length).toBe(0);
  });

  it('correctly calculates match count for consecutive symbols', () => {
    const winningLines = [{ pattern: 'Bottom Row', symbols: [4, 4, 2, 4, 4] }];

    const { container } = renderWithProviders(<GameBoard />, {
      slotMachine: { slots: mockSlots, winningLines: winningLines }
    });

    const winningCells = container.querySelectorAll('.winning-cell');
    expect(winningCells).toHaveLength(2);
  });

  it('returns null if no slots are provided', () => {
    const { container } = renderWithProviders(<GameBoard />, {
      slotMachine: { slots: null, winningLines: [] }
    });
    
    expect(container.secondChild).toBeUndefined();
  });

  it('renders correct image paths for slot items', () => {
    renderWithProviders(<GameBoard />, {
      slotMachine: { slots: [[5]], winningLines: [] }
    });

    const img = screen.getByAltText('slot-item-5');
    expect(img).toHaveAttribute('src', '/images/slot-items/slot_item_005.jpg');
  });
});
