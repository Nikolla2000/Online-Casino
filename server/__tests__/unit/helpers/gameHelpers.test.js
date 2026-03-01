const { 
  saveTransaction, 
  validateUserAndCredits, 
  isValidChipValue, 
  formatCredits 
} = require('../../../helpers/gameHelpers');
const Transaction = require('../../../models/Transaction.model');

jest.mock('../../../models/Transaction.model');

describe('Game Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTransaction', () => {
    it('should successfully save a transaction', async () => {
      const mockTransactionData = {
        userId: '123',
        type: 'slots_bet',
        amount: 100,
        balanceBefore: 1000,
        balanceAfter: 900,
        gameType: 'slots',
        gameId: '1'
      };

      const mockSavedTransaction = {
        _id: '789',
        ...mockTransactionData,
        timestamp: expect.any(Date)
      };

      Transaction.create.mockResolvedValue(mockSavedTransaction);

      const result = await saveTransaction(mockTransactionData);

      expect(Transaction.create).toHaveBeenCalledWith({
        ...mockTransactionData,
        timestamp: expect.any(Date)
      });
      expect(result).toEqual(mockSavedTransaction);
    });

    it('should handle database errors without throwing', async () => {
      const mockTransactionData = {
        userId: '123',
        type: 'BET',
        amount: 100,
        balanceBefore: 1000,
        balanceAfter: 900,
        gameType: 'roulette'
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      Transaction.create.mockRejectedValue(new Error('Database error'));

      const result = await saveTransaction(mockTransactionData);

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
          'Error saving transaction:',
          expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('validateUserAndCredits', () => {
    it('should return user when user exists and has enough credits', async () => {
        const mockUser = {
            _id: '123',
            username: 'testuser',
            totalCredits: 1000
        };

        const User = {
            findById: jest.fn().mockResolvedValue(mockUser)
        };

        const result = await validateUserAndCredits('123', 500, User);

        expect(User.findById).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockUser);
    });

    it('should throw 400 error when user has insufficient credits', async () => {
        const mockUser = {
            _id: '123',
            username: 'testuser',
            totalCredits: 100
        };

        const User = {
            findById: jest.fn().mockResolvedValue(mockUser)
        };

        await expect(validateUserAndCredits('123', 500, User))
            .rejects
            .toThrow('Insufficient credits');

        try {
            await validateUserAndCredits('123', 500, User);
        } catch (error) {
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe('Insufficient credits');
        }
    });

    it('should handle exact credit match', async () => {
        const mockUser = {
            _id: '123',
            username: 'testuser',
            totalCredits: 500
        };

        const User = {
            findById: jest.fn().mockResolvedValue(mockUser)
        };

        const result = await validateUserAndCredits('123', 500, User);

        expect(result).toEqual(mockUser);
    });

    it('should propagate database errors', async () => {
        const User = {
            findById: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        };

        await expect(validateUserAndCredits('123', 500, User))
            .rejects
            .toThrow('Database connection failed');
    });
  });

  describe('isValidChipValue', () => {
    it('should return true for valid chip values', () => {
        const validValues = [5, 10, 25, 50, 100];
        
        validValues.forEach(value => {
            expect(isValidChipValue(value)).toBe(true);
        });
    });

    it('should return false for invalid chip values', () => {
        const invalidValues = [1, 2, 3, 7, 15, 20, 30, 75, 200, 1000, -5, 0, 'fa'];
        
        invalidValues.forEach(value => {
            expect(isValidChipValue(value)).toBe(false);
        });
    });

    it('should handle non-number inputs', () => {
        expect(isValidChipValue('5')).toBe(false);
        expect(isValidChipValue(null)).toBe(false);
        expect(isValidChipValue(undefined)).toBe(false);
        expect(isValidChipValue({})).toBe(false);
        expect(isValidChipValue([])).toBe(false);
        expect(isValidChipValue(true)).toBe(false);
    });
});

  describe('formatCredits', () => {
    it('should floor decimal numbers', () => {
        expect(formatCredits(100.7)).toBe(100);
        expect(formatCredits(100.1)).toBe(100);
        expect(formatCredits(99.9)).toBe(99);
    });

    it('should return same integer for whole numbers', () => {
        expect(formatCredits(100)).toBe(100);
        expect(formatCredits(0)).toBe(0);
        expect(formatCredits(-50)).toBe(-50);
    });

    it('should handle large numbers', () => {
        expect(formatCredits(1000000.99)).toBe(1000000);
        expect(formatCredits(999999.01)).toBe(999999);
    });

    it('should handle negative decimals', () => {
        expect(formatCredits(-50.7)).toBe(-51); // Math.floor(-50.7) === -51
        expect(formatCredits(-50.1)).toBe(-51);
    });

    it('should handle string numbers', () => {
        expect(formatCredits('100.7')).toBe(100);
        expect(formatCredits('100')).toBe(100);
    });

    it('should handle NaN and other edge cases', () => {
        expect(formatCredits(NaN)).toBeNaN();
        expect(formatCredits(Infinity)).toBe(Infinity);
        expect(formatCredits(-Infinity)).toBe(-Infinity);
    });
  });
})