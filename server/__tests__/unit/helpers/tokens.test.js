const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../../../helpers/tokens');

jest.mock('jsonwebtoken');

describe('Token Helpers', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
      jest.clearAllMocks();
      process.env = { ...OLD_ENV };
  });

  afterAll(() => {
      process.env = OLD_ENV;
  });

  describe('generateAccessToken', () => {
      it('should generate access token with correct params', () => {
          const mockToken = 'mock.access.token';
          jwt.sign.mockReturnValue(mockToken);

          process.env.ACCESS_TOKEN_SECRET = 'test_access_secret';
          const userId = '12345';

          const result = generateAccessToken(userId);

          expect(jwt.sign).toHaveBeenCalledWith(
              { userId: userId },
              'test_access_secret',
              { expiresIn: '15m' }
          );
          expect(result).toBe(mockToken);
      });

      it('should throw when jwt.sign fails', () => {
          jwt.sign.mockImplementation(() => {
              throw new Error('JWT signing failed');
          });

          process.env.ACCESS_TOKEN_SECRET = 'test_access_secret';
          
          expect(() => generateAccessToken('123')).toThrow('JWT signing failed');
      });

      it('should handle missing ACCESS_TOKEN_SECRET gracefully', () => {
          delete process.env.ACCESS_TOKEN_SECRET;
        
          jwt.sign.mockReturnValue('token.with.undefined.secret');
          const result = generateAccessToken('123');
          expect(jwt.sign).toHaveBeenCalledWith(
              { userId: '123' },
              undefined,
              { expiresIn: '15m' }
          );
          expect(result).toBe('token.with.undefined.secret');
      });
  });

  describe('generateRefreshToken', () => {
      it('should generate refresh token with correct params', () => {
          const mockToken = 'mock.refresh.token';
          jwt.sign.mockReturnValue(mockToken);

          process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
          const userId = '12345';

          const result = generateRefreshToken(userId);

          expect(jwt.sign).toHaveBeenCalledWith(
              { userId: userId },
              'test_refresh_secret',
              { expiresIn: '7d' }
          );
          expect(result).toBe(mockToken);
      });
  });
});