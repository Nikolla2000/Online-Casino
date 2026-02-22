// Mock Redis за тестове
jest.mock('./config/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  incr: jest.fn(),
  decr: jest.fn(),
  pExpire: jest.fn(),
  pTTL: jest.fn(),
}));

// Увеличи timeout за async тестове
jest.setTimeout(10000);