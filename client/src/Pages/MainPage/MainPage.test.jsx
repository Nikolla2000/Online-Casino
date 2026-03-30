import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import HeaderSection from './Sections/HeaderSection/HeaderSection';
import IntroductionSection from './Sections/IntroductionSection/IntroductionSection';

vi.mock('/images/background-video4.mp4', () => ({
    default: 'mock-video-file'
}))

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe = (target) => {
    mockObserve(target);
    // simulation of entering the screen immediately to make setIsVisible true
    this.callback([{ isIntersecting: true, target }]);
  };
  
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
}

window.IntersectionObserver = MockIntersectionObserver;

describe('Main Page Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('HeaderSection', () => {
    it('renders main headings and stats correctly', () => {
      renderWithProviders(<HeaderSection />);

      expect(screen.queryAllByText(/YOUR/i)[0]).toBeInTheDocument();
      expect(screen.queryAllByText(/WINNINGS/i)[0]).toBeInTheDocument();
      expect(screen.queryAllByText(/10K\+/i)[0]).toBeInTheDocument();
      expect(screen.queryAllByText(/Players Online/i)[0]).toBeInTheDocument();
    });

    it('contains correct navigation links', () => {
      renderWithProviders(<HeaderSection />);

      const startPlayingBtn = screen.getByRole('link', { name: /start playing/i });
      const learnMoreBtn = screen.getByRole('link', { name: /learn more/i });

      expect(startPlayingBtn).toHaveAttribute('href', '/games');
      expect(learnMoreBtn).toHaveAttribute('href', '/about');
    });

    it('renders the video background', () => {
      const { container } = renderWithProviders(<HeaderSection />);
      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveClass('video-background');
    });
  });


  describe('IntroductionSection', () => {
    it('renders heading and features', () => {
      renderWithProviders(<IntroductionSection />);

      expect(screen.getByText(/Ultimate/i)).toBeInTheDocument();
      expect(screen.getByText(/Gaming/i)).toBeInTheDocument();
      expect(screen.getByText(/Experience/i)).toBeInTheDocument();
      expect(screen.getByText(/Secure Platform/i)).toBeInTheDocument();
    });

    it('triggers animation on intersection', () => {
      const { container } = renderWithProviders(<IntroductionSection />);
      
      const imageWrapper = container.querySelector('.image-wrapper');
      const textWrapper = container.querySelector('.text-wrapper');

      expect(imageWrapper).toHaveClass('animate-in');
      expect(textWrapper).toHaveClass('animate-in');
      expect(mockObserve).toHaveBeenCalled();
    });

    it('renders the illustration image with correct alt text', () => {
      renderWithProviders(<IntroductionSection />);
      const img = screen.getByAltText(/cards and chips/i);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/cards-and-chips.png');
    });
  });
});
