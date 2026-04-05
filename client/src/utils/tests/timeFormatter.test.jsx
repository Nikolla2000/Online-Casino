import { formatTimeAgo, formatDate, getMemberDuration } from "../timeFormatter";

describe('Date Helper Functions', () => {
  
  // =====================================
  // formatTimeAgo Tests
  // =====================================
  describe('formatTimeAgo', () => {
    let now;
    
    beforeEach(() => {
      now = new Date('2024-01-15T12:00:00.000Z');
      vi.useFakeTimers();
      vi.setSystemTime(now);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "less than an hour ago" for timestamps less than 60 minutes old', () => {
      const timestamps = [
        new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
        new Date(now.getTime() - 1 * 60 * 1000),  // 1 minute ago
        new Date(now.getTime() - 59 * 60 * 1000), // 59 minutes ago
        new Date(now.getTime() - 1000)            // 1 second ago
      ];

      timestamps.forEach(timestamp => {
        expect(formatTimeAgo(timestamp.toISOString())).toBe('less than an hour ago');
      });
    });

    it('returns correct hour format for timestamps between 1-23 hours ago', () => {
      const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      expect(formatTimeAgo(oneHourAgo.toISOString())).toBe('1 hour ago');

      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(formatTimeAgo(twoHoursAgo.toISOString())).toBe('2 hours ago');

      const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
      expect(formatTimeAgo(twentyThreeHoursAgo.toISOString())).toBe('23 hours ago');
    });

    it('returns correct day format for timestamps between 1-6 days ago', () => {
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(oneDayAgo.toISOString())).toBe('1 day ago');

      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(twoDaysAgo.toISOString())).toBe('2 days ago');

      const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(sixDaysAgo.toISOString())).toBe('6 days ago');
    });

    it('returns correct week format for timestamps 7+ days ago', () => {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(oneWeekAgo.toISOString())).toBe('1 week ago');

      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(twoWeeksAgo.toISOString())).toBe('2 weeks ago');

      const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(threeWeeksAgo.toISOString())).toBe('3 weeks ago');

      const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(fourWeeksAgo.toISOString())).toBe('4 weeks ago');
    });

    it('handles exact boundaries correctly', () => {
      const exactly60Minutes = new Date(now.getTime() - 60 * 60 * 1000);
      expect(formatTimeAgo(exactly60Minutes.toISOString())).toBe('1 hour ago');

      const exactly24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(exactly24Hours.toISOString())).toBe('1 day ago');

      const exactly7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      expect(formatTimeAgo(exactly7Days.toISOString())).toBe('1 week ago');
    });

    it('handles future timestamps (negative difference)', () => {
      const futureTimestamp = new Date(now.getTime() + 1000);
      expect(formatTimeAgo(futureTimestamp.toISOString())).toBe('less than an hour ago');
    });
  });

  // =====================================
  // formatDate Tests
  // =====================================
  describe('formatDate', () => {
    it('formats date correctly with all components', () => {
      const timestamp = '2024-01-15T14:30:00.000Z';
      const result = formatDate(timestamp);
      
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('handles different months correctly', () => {
      const testCases = [
        { date: '2024-01-15T12:00:00Z', expectedMonth: 'Jan' },
        { date: '2024-02-15T12:00:00Z', expectedMonth: 'Feb' },
        { date: '2024-03-15T12:00:00Z', expectedMonth: 'Mar' },
        { date: '2024-04-15T12:00:00Z', expectedMonth: 'Apr' },
        { date: '2024-05-15T12:00:00Z', expectedMonth: 'May' },
        { date: '2024-06-15T12:00:00Z', expectedMonth: 'Jun' },
        { date: '2024-07-15T12:00:00Z', expectedMonth: 'Jul' },
        { date: '2024-08-15T12:00:00Z', expectedMonth: 'Aug' },
        { date: '2024-09-15T12:00:00Z', expectedMonth: 'Sep' },
        { date: '2024-10-15T12:00:00Z', expectedMonth: 'Oct' },
        { date: '2024-11-15T12:00:00Z', expectedMonth: 'Nov' },
        { date: '2024-12-15T12:00:00Z', expectedMonth: 'Dec' }
      ];

      testCases.forEach(({ date, expectedMonth }) => {
        const result = formatDate(date);
        expect(result).toContain(expectedMonth);
      });
    });

    it('handles different days of month correctly', () => {
      const testCases = [1, 5, 10, 15, 20, 25, 31];
      
      testCases.forEach(day => {
        const timestamp = `2024-01-${String(day).padStart(2, '0')}T12:00:00Z`;
        const result = formatDate(timestamp);
        expect(result).toContain(day.toString());
      });
    });

    it('handles different years correctly', () => {
      const testCases = [2020, 2021, 2022, 2023, 2024];
      
      testCases.forEach(year => {
        const timestamp = `${year}-01-15T12:00:00Z`;
        const result = formatDate(timestamp);
        expect(result).toContain(year.toString());
      });
    });

    // it('handles different times correctly', () => {
    //   const testCases = [
    //     { time: '00:00', expected: '12:00 AM' },
    //     { time: '06:30', expected: '06:30 AM' },
    //     { time: '12:00', expected: '12:00 PM' },
    //     { time: '15:45', expected: '03:45 PM' },
    //     { time: '23:59', expected: '11:59 PM' }
    //   ];

    //   testCases.forEach(({ time, expected }) => {
    //     const timestamp = `2024-01-15T${time}:00Z`;
    //     const result = formatDate(timestamp);
    //     expect(result).toContain(expected);
    //   });
    // });

    it('formats date in en-US locale format', () => {
      const timestamp = '2024-01-15T14:30:00.000Z';
      const result = formatDate(timestamp);
      
      expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2} [AP]M$/);
    });

    it('handles timestamp as Date object', () => {
      const date = new Date('2024-01-15T14:30:00.000Z');
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  // =====================================
  // getMemberDuration Tests
  // =====================================
  describe('getMemberDuration', () => {
    let now;
    
    beforeEach(() => {
      now = new Date('2024-01-15T12:00:00.000Z');
      vi.useFakeTimers();
      vi.setSystemTime(now);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns days for registration less than 30 days old', () => {
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(oneDayAgo.toISOString())).toBe('1 days');
      
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(fifteenDaysAgo.toISOString())).toBe('15 days');
      
      const twentyNineDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(twentyNineDaysAgo.toISOString())).toBe('29 days');
    });

    it('returns months for registration between 30-364 days old', () => {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(thirtyDaysAgo.toISOString())).toBe('1 month');
      
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(sixtyDaysAgo.toISOString())).toBe('2 months');
      
      const oneFiftyDaysAgo = new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(oneFiftyDaysAgo.toISOString())).toBe('5 months');
      
      const threeHundredSixtyFourDaysAgo = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(threeHundredSixtyFourDaysAgo.toISOString())).toBe('12 months');
    });

    it('returns years for registration 365+ days old', () => {
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(oneYearAgo.toISOString())).toBe('1 year');
      
      const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(twoYearsAgo.toISOString())).toBe('2 years');
      
      const threeYearsAgo = new Date(now.getTime() - 1095 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(threeYearsAgo.toISOString())).toBe('3 years');
    });

    it('handles exact boundaries correctly', () => {
      const exactly30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(exactly30Days.toISOString())).toBe('1 month');
      
      const exactly365Days = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(exactly365Days.toISOString())).toBe('1 year');
    });

    it('handles future registration dates', () => {
      const futureDate = new Date(now.getTime() + 1000);
      expect(getMemberDuration(futureDate.toISOString())).toBe('1 days');
    });

    it('handles registration from today', () => {
      const today = now.toISOString();
      expect(getMemberDuration(today)).toBe('0 days');
    });

    it('uses ceil for days calculation', () => {
      const oneDayOneHour = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      expect(getMemberDuration(oneDayOneHour.toISOString())).toBe('2 days');
      
      const twentyNineDays23Hours = new Date(now.getTime() - (29 * 24 + 23) * 60 * 60 * 1000);
      expect(getMemberDuration(twentyNineDays23Hours.toISOString())).toBe('1 month');
    });

    it('returns correct pluralization for all forms', () => {
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(twoDaysAgo.toISOString())).toBe('2 days');
      
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(thirtyDaysAgo.toISOString())).toBe('1 month');
      
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(sixtyDaysAgo.toISOString())).toBe('2 months');
      
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(oneYearAgo.toISOString())).toBe('1 year');
      
      const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
      expect(getMemberDuration(twoYearsAgo.toISOString())).toBe('2 years');
    });
  });

  // =====================================
  // Edge Cases and Integration Tests
  // =====================================
  describe('Edge cases and integration', () => {
    let now;
    
    beforeEach(() => {
      now = new Date('2024-01-15T12:00:00.000Z');
      vi.useFakeTimers();
      vi.setSystemTime(now);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('all three functions handle the same timestamp consistently', () => {
      const timestamp = '2024-01-01T10:00:00.000Z';
      
      const timeAgo = formatTimeAgo(timestamp);
      const formattedDate = formatDate(timestamp);
      const duration = getMemberDuration(timestamp);
      
      expect(timeAgo).toBeTruthy();
      expect(formattedDate).toBeTruthy();
      expect(duration).toBeTruthy();
      
      expect(timeAgo).toBe('2 weeks ago');
      expect(duration).toBe('15 days');
    });

    it('handles leap year dates correctly', () => {
      const leapYearDate = '2020-02-29T12:00:00.000Z';
      
      expect(() => formatDate(leapYearDate)).not.toThrow();
      expect(() => formatTimeAgo(leapYearDate)).not.toThrow();
      expect(() => getMemberDuration(leapYearDate)).not.toThrow();
    });

    it('handles end of month dates correctly', () => {
      const endOfMonth = '2024-01-31T23:59:59.999Z';
      
      expect(() => formatDate(endOfMonth)).not.toThrow();
      expect(() => formatTimeAgo(endOfMonth)).not.toThrow();
      expect(() => getMemberDuration(endOfMonth)).not.toThrow();
    });
  });
});