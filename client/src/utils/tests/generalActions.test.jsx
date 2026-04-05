import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { playSound, fadeOutAudio, capitalize } from '../generalActions';

describe('General Actions Utility Functions', () => {
  
  // =====================================
  // playSound Tests
  // =====================================
  describe('playSound', () => {
    let mockAudio;

    beforeEach(() => {
      mockAudio = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        volume: 1,
        currentTime: 0
      };

      global.Audio = vi.fn().mockImplementation(function() {
        return mockAudio;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
      delete global.Audio;
    });

    it('creates Audio with correct file path', () => {
      playSound('/sounds/test.mp3', false);

      expect(global.Audio).toHaveBeenCalledWith('/sounds/test.mp3');
    });

    it('plays sound when isSoundOn is true', () => {
      playSound('/sounds/test.mp3', true);

      expect(mockAudio.play).toHaveBeenCalled();
    });

    it('does not play sound when isSoundOn is false', () => {
      playSound('/sounds/test.mp3', false);

      expect(mockAudio.play).not.toHaveBeenCalled();
    });

    it('returns the audio object', () => {
      const result = playSound('/sounds/test.mp3', true);

      expect(result).toBe(mockAudio);
    });

    it('returns audio object even when not playing', () => {
      const result = playSound('/sounds/test.mp3', false);

      expect(result).toBe(mockAudio);
    });
  });

  // =====================================
  // fadeOutAudio Tests
  // =====================================
  describe('fadeOutAudio', () => {
    let mockAudio;

    beforeEach(() => {
      vi.useFakeTimers();
      mockAudio = {
        volume: 1,
        pause: vi.fn(),
        currentTime: 5
      };
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('does nothing when audio is null', () => {
      fadeOutAudio(null, 1000);
      expect(true).toBe(true);
    });

    it('does nothing when audio is undefined', () => {
      fadeOutAudio(undefined, 1000);
      expect(true).toBe(true);
    });

    it('gradually reduces volume', () => {
      fadeOutAudio(mockAudio, 1000);
      
      const initialVolume = mockAudio.volume;
      vi.advanceTimersByTime(500);
      
      expect(mockAudio.volume).toBeLessThan(initialVolume);
      expect(mockAudio.volume).toBeGreaterThan(0);
    });

    it('pauses audio when fade out completes', () => {
      fadeOutAudio(mockAudio, 1000);
      
      vi.runAllTimers();
      
      expect(mockAudio.pause).toHaveBeenCalled();
    });

    it('resets currentTime to 0 when fade out completes', () => {
      fadeOutAudio(mockAudio, 1000);
      
      vi.runAllTimers();
      
      expect(mockAudio.currentTime).toBe(0);
    });

    it('sets volume to 0 when complete', () => {
      fadeOutAudio(mockAudio, 1000);
      
      vi.runAllTimers();
      
      expect(mockAudio.volume).toBeCloseTo(0, 10);
    });

    it('handles short duration fade out', () => {
      fadeOutAudio(mockAudio, 100);
      
      vi.runAllTimers();
      
      expect(mockAudio.pause).toHaveBeenCalled();
      expect(mockAudio.currentTime).toBe(0);
    });
  });

  // =====================================
  // capitalize Tests
  // =====================================
  describe('capitalize', () => {
    it('capitalizes first letter of lowercase string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('capitalizes first letter of all lowercase string', () => {
      expect(capitalize('world')).toBe('World');
    });

    it('keeps already capitalized string unchanged', () => {
      expect(capitalize('Already')).toBe('Already');
    });

    it('handles single character string', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('handles single uppercase character', () => {
      expect(capitalize('A')).toBe('A');
    });

    it('capitalizes first letter and keeps rest unchanged', () => {
      expect(capitalize('hELLO')).toBe('HELLO');
    });

    it('handles string with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles string starting with space', () => {
      expect(capitalize(' hello')).toBe(' hello');
    });

    it('capitalizes game names correctly', () => {
      expect(capitalize('slots')).toBe('Slots');
      expect(capitalize('roulette')).toBe('Roulette');
      expect(capitalize('blackjack')).toBe('Blackjack');
    });

    it('handles multi-word strings (only first letter)', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });
  });
});