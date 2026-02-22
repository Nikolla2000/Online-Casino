const { hashPassword, comparePasswords  } = require('../../../helpers/auth');

describe('Auth Helpers', () => {
  describe('hashPassword', () => {
    it('should hash password', async () => {
      const password = 'testPassword123Gg!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123Gg!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123Gg!';
      const hash = await hashPassword(password);

      const result = await comparePasswords(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for wrong passwords', async () => {
      const password = 'testPassword123Gg!';
      const wrongPassword = 'wrongPassword123Hh?';
      const hash = await hashPassword(password);

      const result = await comparePasswords(wrongPassword, hash);

      expect(result).toBe(false);
    })
  })
});