import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CoinRain from '../Gadgets/CoinRain';

describe('CoinRain Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when isActive is false', () => {
    const { container } = render(<CoinRain isActive={false} winAmount={100} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders coins when isActive is true and winAmount > 0', () => {
    const { container } = render(<CoinRain isActive={true} winAmount={100} />);
    
    const coinContainer = container.querySelector('.coin-rain-container');
    expect(coinContainer).toBeInTheDocument();
    
    const coins = container.querySelectorAll('.coin');
    expect(coins.length).toBeGreaterThan(0);
  });

  it('shows "BIG WIN" text only when winAmount >= 500', () => {
    const { rerender } = render(<CoinRain isActive={true} winAmount={100} />);
    expect(screen.queryByText(/BIG WIN!/i)).not.toBeInTheDocument();

    rerender(<CoinRain isActive={true} winAmount={550} />);
    expect(screen.getByText(/BIG WIN!/i)).toBeInTheDocument();
    expect(screen.getByText(/\$550/i)).toBeInTheDocument();
    
    const container = screen.getByText(/BIG WIN!/i).closest('.coin-rain-container');
    expect(container).toHaveClass('big-win');
  });

  it('calculates more coins for larger wins (up to 50)', () => {
    const { container, rerender } = render(<CoinRain isActive={true} winAmount={10} />);
    const smallWinCoins = container.querySelectorAll('.coin').length;

    rerender(<CoinRain isActive={true} winAmount={1000} />);
    const bigWinCoins = container.querySelectorAll('.coin').length;

    expect(bigWinCoins).toBeGreaterThan(smallWinCoins);
    expect(bigWinCoins).toBeLessThanOrEqual(50);
  });

  it('clears coins after 3.5 seconds', async () => {
    const { container } = render(<CoinRain isActive={true} winAmount={100} />);
    
    expect(container.querySelectorAll('.coin').length).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(container.firstChild).toBeNull();
  });

  it('applies correct random styles to coins', () => {
    const { container } = render(<CoinRain isActive={true} winAmount={100} />);
    const firstCoin = container.querySelector('.coin');
    
    const style = firstCoin.getAttribute('style');
  
    expect(style).toContain('left:');
    expect(style).toContain('%');
    expect(style).toContain('animation-delay:');
    expect(style).toContain('s');
  });
});
