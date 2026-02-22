const userService = require('../../../services/userService');
const User = require('../../../models/User.model');
const { ValidationError } = require('../../../helpers/errors');

jest.mock('../../../models/User.model');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalCredits', () => {
    it('should return user total credits', async () => {
      const mockUser = {
        _id: '123',
        username: 'testUser',
        totalCredits: 1000
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUser)
      });

      const result = await userService.getTotalCredits('123');

      expect(result).toEqual({
        totalCredits: 1000
      })
      expect(User.findById).toHaveBeenCalledWith('123');
    })

    it('should throw error if user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null) 
      });

      await expect(userService.getTotalCredits('999'))
        .rejects
        .toThrow('User');
    });
  })
})