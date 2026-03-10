const RouletteService = require('../../../services/rouletteService');
const User = require('../../../models/User.model');
const GameHistory = require('../../../models/GameHistory.model');
const redis = require('../../../config/redis');
const { validateUserAndCredits } = require('../../../helpers/gameHelpers');

jest.mock('../../../models/User.model');
jest.mock('../../../models/GameHistory.model');
jest.mock('../../../config/redis');
jest.mock('../../../helpers/gameHelpers');
jest.mock('../../../helpers/logger');

describe('RouletteService', () => {
  let mockUser;
  const validUserId = '507f1f77bcf86cd799439011';
  const validBetAmount = 50;
  const validBetType = 'red';

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUser = {
      _id: validUserId,
      totalCredits: 1000,
      totalWagered: 0,
      totalWon: 0,
      gamesPlayed: 0
    };

    validateUserAndCredits.mockResolvedValue(mockUser);
    
    redis.del.mockResolvedValue(true);
  });

  describe('validateBet', () => {
    it('should throw error for invalid bet type', () => {
      expect(() => RouletteService.validateBet(validBetAmount, 'invalid_type', null))
        .toThrow('Invalid bet type');
    });

    it('should throw error for number bet without value', () => {
      expect(() => RouletteService.validateBet(validBetAmount, 'number', null))
        .toThrow('Bet value is required for number bets');
    });

    it('should throw error for number bet with invalid value (<0)', () => {
      expect(() => RouletteService.validateBet(validBetAmount, 'number', -1))
        .toThrow('Bet value must be between 0 and 36');
    });

    it('should throw error for number bet with invalid value (>36)', () => {
      expect(() => RouletteService.validateBet(validBetAmount, 'number', 37))
        .toThrow('Bet value must be between 0 and 36');
    });

    it('should pass for valid red bet', () => {
      expect(() => RouletteService.validateBet(validBetAmount, 'red', null))
        .not.toThrow();
    });

    it('should pass for valid number bet', () => {
      expect(() => RouletteService.validateBet(validBetAmount, 'number', 17))
        .not.toThrow();
    });
  });

  describe('generateResult', () => {
    it('should generate result with number between 0-36', () => {
      const result = RouletteService.generateResult();
      
      expect(result).toHaveProperty('randNumber');
      expect(result).toHaveProperty('color');
      expect(result.randNumber).toBeGreaterThanOrEqual(0);
      expect(result.randNumber).toBeLessThanOrEqual(36);
    });

    it('should return correct color for green numbers (0)', () => {
      const mockMath = Object.create(global.Math);
      mockMath.random = jest.fn(() => 0);
      global.Math = mockMath;

      const result = RouletteService.generateResult();
      expect(result.color).toBe('green');
    });

    it('should return correct color for red numbers', () => {
      const mockMath = Object.create(global.Math);
      mockMath.random = jest.fn(() => 1/37);
      global.Math = mockMath;

      const result = RouletteService.generateResult();
      expect(result.color).toBe('red');
    });

    it('should return correct color for black numbers', () => {
      const mockMath = Object.create(global.Math);
      mockMath.random = jest.fn(() => 2/37);
      global.Math = mockMath;

      const result = RouletteService.generateResult();
      expect(result.color).toBe('black');
    });
  });

  describe('calculateWin', () => {
    const betAmount = 100;

    describe('number bets', () => {
      it('should win on exact number match', () => {
        const spinResult = { randNumber: 17, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'number', 17, betAmount);
        
        expect(result.isWin).toBe(true);
        expect(result.multiplier).toBe(35);
        expect(result.winAmount).toBe(3600);
      });

      it('should lose on number mismatch', () => {
        const spinResult = { randNumber: 17, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'number', 5, betAmount);
        
        expect(result.isWin).toBe(false);
        expect(result.multiplier).toBe(0);
        expect(result.winAmount).toBe(0);
      });
    });

    describe('color bets', () => {
      it('should win on red bet when red hits', () => {
        const spinResult = { randNumber: 1, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'red', null, betAmount);
        
        expect(result.isWin).toBe(true);
        expect(result.multiplier).toBe(1);
        expect(result.winAmount).toBe(200);
      });

      it('should lose on red bet when black hits', () => {
        const spinResult = { randNumber: 2, color: 'black' };
        
        const result = RouletteService.calculateWin(spinResult, 'red', null, betAmount);
        
        expect(result.isWin).toBe(false);
        expect(result.winAmount).toBe(0);
      });
    });

    describe('even/odd bets', () => {
      it('should win on even bet when even hits (except 0)', () => {
        const spinResult = { randNumber: 2, color: 'black' };
        
        const result = RouletteService.calculateWin(spinResult, 'even', null, betAmount);
        
        expect(result.isWin).toBe(true);
        expect(result.multiplier).toBe(1);
      });

      it('should lose on even bet when odd hits', () => {
        const spinResult = { randNumber: 1, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'even', null, betAmount);
        
        expect(result.isWin).toBe(false);
      });

      it('should lose on even bet when 0 hits', () => {
        const spinResult = { randNumber: 0, color: 'green' };
        
        const result = RouletteService.calculateWin(spinResult, 'even', null, betAmount);
        
        expect(result.isWin).toBe(false);
      });
    });

    describe('low/high bets', () => {
      it('should win on low bet (1-18)', () => {
        const spinResult = { randNumber: 5, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'low', null, betAmount);
        
        expect(result.isWin).toBe(true);
      });

      it('should lose on low bet (19-36)', () => {
        const spinResult = { randNumber: 20, color: 'black' };
        
        const result = RouletteService.calculateWin(spinResult, 'low', null, betAmount);
        
        expect(result.isWin).toBe(false);
      });
    });

    describe('dozen bets', () => {
      it('should win on first dozen (1-12)', () => {
        const spinResult = { randNumber: 7, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'first_dozen', null, betAmount);
        
        expect(result.isWin).toBe(true);
        expect(result.multiplier).toBe(2);
      });

      it('should win on second dozen (13-24)', () => {
        const spinResult = { randNumber: 15, color: 'black' };
        
        const result = RouletteService.calculateWin(spinResult, 'second_dozen', null, betAmount);
        
        expect(result.isWin).toBe(true);
        expect(result.multiplier).toBe(2);
      });

      it('should win on third dozen (25-36)', () => {
        const spinResult = { randNumber: 30, color: 'red' };
        
        const result = RouletteService.calculateWin(spinResult, 'third_dozen', null, betAmount);
        
        expect(result.isWin).toBe(true);
        expect(result.multiplier).toBe(2);
      });
    });
  });

  describe('playRound', () => {
    it('should throw error if user validation fails', async () => {
      validateUserAndCredits.mockRejectedValue(new Error('User not found'));
      
      await expect(RouletteService.playRound(validUserId, validBetAmount, 'red'))
        .rejects
        .toThrow('User not found');
    });

    it('should successfully play round with red bet', async () => {
      jest.spyOn(RouletteService, 'generateResult').mockReturnValue({
        randNumber: 1,
        color: 'red'
      });

      const mockUpdatedUser = { 
        ...mockUser, 
        totalCredits: 1150,
        totalWagered: validBetAmount,
        totalWon: 200,
        gamesPlayed: 1
      };
      User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      const result = await RouletteService.playRound(validUserId, validBetAmount, 'red');

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('spinResult');
      expect(result).toHaveProperty('betAmount', validBetAmount);
      expect(result).toHaveProperty('betType', 'red');
      expect(result).toHaveProperty('isWin', true);
      expect(result).toHaveProperty('winAmount', 100);
      expect(result).toHaveProperty('multiplier', 1);
      expect(result).toHaveProperty('netProfit', 50);
      expect(result).toHaveProperty('balanceBefore', 1000);
      expect(result).toHaveProperty('balanceAfter', 1150);
      expect(result).toHaveProperty('gameId');

      expect(redis.del).toHaveBeenCalledTimes(3);
    });

    it('should successfully play round with losing bet', async () => {
      jest.spyOn(RouletteService, 'generateResult').mockReturnValue({
        randNumber: 2,
        color: 'black'
      });

      const mockUpdatedUser = { 
        ...mockUser, 
        totalCredits: 950,
        totalWagered: validBetAmount,
        totalWon: 0,
        gamesPlayed: 1
      };
      User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      const result = await RouletteService.playRound(validUserId, validBetAmount, 'red');

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('isWin', false);
      expect(result).toHaveProperty('winAmount', 0);
      expect(result).toHaveProperty('multiplier', 0);
      expect(result).toHaveProperty('netProfit', -50);
      expect(result).toHaveProperty('balanceAfter', 950);
    });

    it('should save game history in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      jest.spyOn(RouletteService, 'generateResult').mockReturnValue({
        randNumber: 1,
        color: 'red'
      });

      User.findByIdAndUpdate.mockResolvedValue({ ...mockUser, totalCredits: 1150 });
      
      const mockGameHistory = { _id: 'game123' };
      GameHistory.create.mockResolvedValue(mockGameHistory);

      await RouletteService.playRound(validUserId, validBetAmount, 'red');

      expect(GameHistory.create).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should NOT save game history in test mode', async () => {
      process.env.NODE_ENV = 'test';
      
      jest.spyOn(RouletteService, 'generateResult').mockReturnValue({
        randNumber: 1,
        color: 'red'
      });

      User.findByIdAndUpdate.mockResolvedValue({ ...mockUser, totalCredits: 1150 });

      await RouletteService.playRound(validUserId, validBetAmount, 'red');

      expect(GameHistory.create).not.toHaveBeenCalled();
    });

    it('should handle number bet correctly', async () => {
      jest.spyOn(RouletteService, 'generateResult').mockReturnValue({
        randNumber: 7,
        color: 'red'
      });

      const mockUpdatedUser = { 
        ...mockUser, 
        totalCredits: 4600,
        totalWagered: validBetAmount,
        totalWon: 1800,
        gamesPlayed: 1
      };
      User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      const result = await RouletteService.playRound(validUserId, validBetAmount, 'number', 7);

      expect(result.isWin).toBe(true);
      expect(result.winAmount).toBe(1800);
      expect(result.multiplier).toBe(35);
      expect(result.netProfit).toBe(1750);
    });
  });
});