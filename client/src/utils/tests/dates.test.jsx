import { denormalizeDates, normalizeDates } from "../normalizeDates";

describe('normalizeDates and denormalizeDates', () => {
  
  // =====================================
  // normalizeDates Tests
  // =====================================
  describe('normalizeDates', () => {
    const testDate = new Date('2024-01-15T10:30:00.000Z');
    const testISOString = '2024-01-15T10:30:00.000Z';

    it('returns non-object values unchanged', () => {
      expect(normalizeDates(null)).toBe(null);
      expect(normalizeDates(undefined)).toBe(undefined);
      expect(normalizeDates('string')).toBe('string');
      expect(normalizeDates(123)).toBe(123);
      expect(normalizeDates(true)).toBe(true);
    });

    it('converts Date objects to ISO strings for specific fields', () => {
      const input = {
        lastActivity: testDate,
        createdAt: testDate,
        updatedAt: testDate,
        lastSeen: testDate,
        timestamp: testDate,
        readAt: testDate
      };

      const result = normalizeDates(input);

      expect(result.lastActivity).toBe(testISOString);
      expect(result.createdAt).toBe(testISOString);
      expect(result.updatedAt).toBe(testISOString);
      expect(result.lastSeen).toBe(testISOString);
      expect(result.timestamp).toBe(testISOString);
      expect(result.readAt).toBe(testISOString);
    });

    it('leaves already string dates unchanged', () => {
      const input = {
        lastActivity: testISOString,
        createdAt: testISOString
      };

      const result = normalizeDates(input);

      expect(result.lastActivity).toBe(testISOString);
      expect(result.createdAt).toBe(testISOString);
      expect(typeof result.lastActivity).toBe('string');
    });

    it('handles nested objects recursively', () => {
      const input = {
        user: {
          lastActivity: testDate,
          profile: {
            updatedAt: testDate,
            name: 'John'
          }
        }
      };

      const result = normalizeDates(input);

      expect(result.user.lastActivity).toBe(testISOString);
      expect(result.user.profile.updatedAt).toBe(testISOString);
      expect(result.user.profile.name).toBe('John');
    });

    it('handles arrays recursively', () => {
      const input = {
        activities: [
          { lastActivity: testDate, name: 'Login' },
          { lastActivity: testDate, name: 'Logout' }
        ]
      };

      const result = normalizeDates(input);

      expect(result.activities[0].lastActivity).toBe(testISOString);
      expect(result.activities[1].lastActivity).toBe(testISOString);
      expect(result.activities[0].name).toBe('Login');
    });

    it('handles nested arrays within objects', () => {
      const input = {
        events: [
          {
            timestamp: testDate,
            items: [
              { createdAt: testDate, value: 1 },
              { createdAt: testDate, value: 2 }
            ]
          }
        ]
      };

      const result = normalizeDates(input);

      expect(result.events[0].timestamp).toBe(testISOString);
      expect(result.events[0].items[0].createdAt).toBe(testISOString);
      expect(result.events[0].items[1].createdAt).toBe(testISOString);
    });

    it('preserves other properties', () => {
      const input = {
        lastActivity: testDate,
        name: 'John Doe',
        age: 30,
        isActive: true,
        tags: ['user', 'premium']
      };

      const result = normalizeDates(input);

      expect(result.lastActivity).toBe(testISOString);
      expect(result.name).toBe('John Doe');
      expect(result.age).toBe(30);
      expect(result.isActive).toBe(true);
      expect(result.tags).toEqual(['user', 'premium']);
    });

    it('does not modify the original object', () => {
      const input = {
        lastActivity: testDate,
        name: 'John'
      };
      const originalCopy = { ...input };

      normalizeDates(input);

      expect(input).toEqual(originalCopy);
      expect(input.lastActivity).toBeInstanceOf(Date);
    });

    it('handles empty objects', () => {
      const result = normalizeDates({});
      expect(result).toEqual({});
    });

    it('handles objects with null/undefined values', () => {
      const input = {
        lastActivity: null,
        createdAt: undefined,
        name: 'John'
      };

      const result = normalizeDates(input);

      expect(result.lastActivity).toBe(null);
      expect(result.createdAt).toBe(undefined);
      expect(result.name).toBe('John');
    });
  });

  // =====================================
  // denormalizeDates Tests
  // =====================================
  describe('denormalizeDates', () => {
    const testDate = new Date('2024-01-15T10:30:00.000Z');
    const testISOString = '2024-01-15T10:30:00.000Z';

    it('does not modify the original object', () => {
      const input = {
        lastActivity: testISOString,
        name: 'John'
      };
      const originalCopy = { ...input };

      denormalizeDates(input);

      expect(input).toEqual(originalCopy);
      expect(typeof input.lastActivity).toBe('string');
    });

    it('handles empty objects', () => {
      const result = denormalizeDates({});
      expect(result).toEqual({});
    });

    it('handles objects with null/undefined values', () => {
      const input = {
        lastActivity: null,
        createdAt: undefined,
        name: 'John'
      };

      const result = denormalizeDates(input);

      expect(result.lastActivity).toBe(null);
      expect(result.createdAt).toBe(undefined);
      expect(result.name).toBe('John');
    });
  });
});