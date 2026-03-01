const generateUsername = require('../../../helpers/generateUsername');

describe('generateUsername', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('should generate username with first and last name', () => {
        const result = generateUsername('test@test.com', 'John', 'Doe');
        expect(result).toBe('john.doe500');
    });

    it('should generate username with only first name', () => {
        const result = generateUsername('test@test.com', 'John', '');
        expect(result).toBe('john5000');
    });

    it('should generate username with only last name', () => {
        const result = generateUsername('test@test.com', '', 'Doe');
        expect(result).toBe('doe5000');
    });

    it('should generate username from email when no names provided', () => {
        const result = generateUsername('john.doe@test.com', '', '');
        expect(result).toBe('john.doe500');
    });

    it('should handle whitespace in names', () => {
        const result = generateUsername('test@test.com', '  John  ', '  Doe  ');
        expect(result).toBe('john.doe500');
    });

    it('should handle special characters in email', () => {
        const result = generateUsername('john+test@test.com', '', '');
        expect(result).toBe('john+test500');
    });

    it('should generate different usernames with different random values', () => {
        Math.random.mockReturnValueOnce(0.1);
        const result1 = generateUsername('test@test.com', 'John', 'Doe');
        
        Math.random.mockReturnValueOnce(0.9);
        const result2 = generateUsername('test@test.com', 'John', 'Doe');
        
        expect(result1).toBe('john.doe100');
        expect(result2).toBe('john.doe900');
        expect(result1).not.toBe(result2);
    });

    it('should handle null/undefined inputs', () => {
        expect(() => generateUsername('test@test.com', null, undefined)).not.toThrow();
        const result = generateUsername('test@test.com', null, undefined);
        expect(result).toBe('test500');
    });

    it('should handle very long names', () => {
        const longName = 'a'.repeat(100);
        const result = generateUsername('test@test.com', longName, longName);
        expect(result.length).toBeLessThan(250);
        expect(result).toContain('500');
    });
});