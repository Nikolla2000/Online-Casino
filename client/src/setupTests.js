import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup след всеки тест
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('*.mp4', () => ({
  default: 'mock-video-file'
}));
vi.mock('*.webm', () => ({
  default: 'mock-video-file'
}));
vi.mock('*.ogg', () => ({
  default: 'mock-video-file'
}));
vi.mock('*.jpg', () => ({
  default: 'mock-image-file'
}));
vi.mock('*.jpeg', () => ({
  default: 'mock-image-file'
}));
vi.mock('*.png', () => ({
  default: 'mock-image-file'
}));
vi.mock('*.gif', () => ({
  default: 'mock-image-file'
}));
vi.mock('*.svg', () => ({
  default: 'mock-svg-file'
}));