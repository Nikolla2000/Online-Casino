const SlotsService = require('../../../services/slotsService');
const User = require('../../../models/User.model');
const GameHistory = require('../../../models/GameHistory.model');
const redis = require('../../../config/redis');

jest.mock('../../../models/User.model');
jest.mock('../../../models/GameHistory.model');
jest.mock('../../../config/redis');
jest.mock('../../../helpers/gameHelpers');

describe('SlotsService', () => {
  let mockUser;
  const validUserId = '507f1f77bcf86cd799439011';
  const validBetAmount = 500;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUser = {
      _id: validUserId,
      totalCredits: 1000,
      totalWagered: 0,
      totalWon: 0,
      gamesPlayed: 0
    };

    redis.del.mockResolvedValue(true);
  });

  describe('validateBet', () => {
    test('should throw error for invalid bet amount (non-number)', () => {
      expect(() => SlotsService.validateBet('invalid'))
        .toThrow('Invalid bet amount');
    });

    test('should throw error for bet <= 0', () => {
      expect(() => SlotsService.validateBet(0))
        .toThrow('Bet amount must be positive');
      expect(() => SlotsService.validateBet(-100))
        .toThrow('Bet amount must be positive');
    });

    test('should throw error for bet below minimum', () => {
      expect(() => SlotsService.validateBet(50))
        .toThrow('Bet must be between 100 and 1000');
    });

    test('should throw error for bet above maximum', () => {
      expect(() => SlotsService.validateBet(1500))
        .toThrow('Bet must be between 100 and 1000');
    });

    test('should pass for valid bet amount', () => {
      expect(() => SlotsService.validateBet(500)).not.toThrow();
      expect(() => SlotsService.validateBet(100)).not.toThrow();
      expect(() => SlotsService.validateBet(1000)).not.toThrow();
    });
  });

  describe('generateSlotReels', () => {
    test('should generate 3x5 array', () => {
      const reels = SlotsService.generateSlotReels();
      
      expect(reels.length).toBe(3);
      expect(reels[0].length).toBe(5);
      expect(reels[1].length).toBe(5);
      expect(reels[2].length).toBe(5);
    });

    test('should generate numbers between 1 and 12', () => {
      const reels = SlotsService.generateSlotReels();
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          expect(reels[row][col]).toBeGreaterThanOrEqual(1);
          expect(reels[row][col]).toBeLessThanOrEqual(12);
        }
      }
    });
  });

  describe('getMultiplier', () => {
    test('should return correct multiplier for Diamond (symbol 12)', () => {
      expect(SlotsService.getMultiplier(12, 5)).toBe(100);
      expect(SlotsService.getMultiplier(12, 4)).toBe(20);
      expect(SlotsService.getMultiplier(12, 3)).toBe(5);
      expect(SlotsService.getMultiplier(12, 2)).toBe(1.5);
      expect(SlotsService.getMultiplier(12, 1)).toBe(0);
    });

    test('should return correct multiplier for low symbol (symbol 1)', () => {
      expect(SlotsService.getMultiplier(1, 5)).toBe(5);
      expect(SlotsService.getMultiplier(1, 4)).toBe(1.5);
      expect(SlotsService.getMultiplier(1, 3)).toBe(0.3);
      expect(SlotsService.getMultiplier(1, 2)).toBe(0.1);
      expect(SlotsService.getMultiplier(1, 1)).toBe(0);
    });
  });

  describe('checkPayLine', () => {
    test('should detect winning line with 5 matching symbols', () => {
      const reels = [
        [5, 5, 5, 5, 5],
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10]
      ];
      
      const positions = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
      const multiplier = SlotsService.checkPayLine(reels, positions);
      
      expect(multiplier).toBe(15); // symbol 5 with 5 matches = 15x
    });

    test('should detect winning line with 3 matching symbols', () => {
      const reels = [
        [5, 5, 5, 2, 3],
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10]
      ];
      
      const positions = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
      const multiplier = SlotsService.checkPayLine(reels, positions);
      
      expect(multiplier).toBe(1); // symbol 5 with 3 matches = 1x
    });

    test('should return 0 for non-winning line', () => {
      const reels = [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5]
      ];
      
      const positions = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
      const multiplier = SlotsService.checkPayLine(reels, positions);
      
      expect(multiplier).toBe(0);
    });
  });

  describe('calculateWin', () => {
    test('should calculate win for multiple winning lines', () => {
      const reels = [
        [5, 5, 5, 5, 5], // win on top row
        [1, 2, 3, 4, 5],
        [8, 8, 8, 8, 8]  // win on bottom row
      ];
      
      const result = SlotsService.calculateWin(reels, 100);
      
      expect(result.winAmount).toBeGreaterThan(0);
      expect(result.winningLines.length).toBe(2);
      expect(result.multiplier).toBeGreaterThan(0);
    });

    test('should return zero win for no matches', () => {
      const reels = [
        [1, 2, 1, 4, 5],
        [6, 3, 4, 8, 6],
        [2, 1, 5, 2, 7]
      ];
      
      const result = SlotsService.calculateWin(reels, 100);
      
      expect(result.winAmount).toBe(0);
      expect(result.winningLines.length).toBe(0);
      expect(result.multiplier).toBe(0);
    });
  });

  describe('playRound', () => {
    test('should throw error if user not found', async () => {
      User.findById.mockResolvedValue(null);
      
      await expect(SlotsService.playRound(validUserId, validBetAmount))
        .rejects
        .toThrow('User not found');
    });

    test('should throw error if insufficient credits', async () => {
      User.findById.mockResolvedValue({ ...mockUser, totalCredits: 50 });
      
      await expect(SlotsService.playRound(validUserId, validBetAmount))
        .rejects
        .toThrow('Not enough credits');
    });

    test('should successfully play round and update user stats', async () => {
      User.findById.mockResolvedValue(mockUser);
      
      const updatedUser = { 
        ...mockUser, 
        totalCredits: mockUser.totalCredits + 200,
        totalWagered: validBetAmount,
        totalWon: 700,
        gamesPlayed: 1
      };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await SlotsService.playRound(validUserId, validBetAmount);

      // Проверка на резултата
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('betAmount', validBetAmount);
      expect(result).toHaveProperty('winAmount');
      expect(result).toHaveProperty('netProfit');
      expect(result).toHaveProperty('multiplier');
      expect(result).toHaveProperty('reels');
      expect(result).toHaveProperty('winningLines');
      expect(result).toHaveProperty('balanceBefore', 1000);
      expect(result).toHaveProperty('balanceAfter');
      expect(result).toHaveProperty('isWin');
      expect(result).toHaveProperty('gameId');

      expect(redis.del).toHaveBeenCalledTimes(3);
      expect(redis.del).toHaveBeenCalledWith(`user:stats:${validUserId}`);
      expect(redis.del).toHaveBeenCalledWith(`user:history:${validUserId}`);
      expect(redis.del).toHaveBeenCalledWith(`user:recent-activity:${validUserId}`);
    });

    test('should save game history in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockResolvedValue({ ...mockUser, totalCredits: 1200 });
      
      const mockGameHistory = { _id: 'game123' };
      GameHistory.create.mockResolvedValue(mockGameHistory);

      await SlotsService.playRound(validUserId, validBetAmount);

      expect(GameHistory.create).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });

    test('should NOT save game history in test mode', async () => {
      process.env.NODE_ENV = 'test';
      
      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockResolvedValue({ ...mockUser, totalCredits: 1200 });

      await SlotsService.playRound(validUserId, validBetAmount);

      expect(GameHistory.create).not.toHaveBeenCalled();
    });
  });
});