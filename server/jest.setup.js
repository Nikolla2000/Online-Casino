// // Mock Redis за тестове
// jest.mock('./config/redis', () => ({
//   get: jest.fn(),
//   set: jest.fn(),
//   setEx: jest.fn(),
//   del: jest.fn(),
//   incr: jest.fn().mockResolvedValue(1),
//   decr: jest.fn().mockReturnValue(0),
//   pExpire: jest.fn().mockResolvedValue('OK'),
//   pTTL: jest.fn().mockResolvedValue(60000),
// }));

//purvata chast e gore predniqt variant

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  incr: jest.fn().mockResolvedValue(1), // Връща число
  decr: jest.fn().mockResolvedValue(0), // Връща число
  pExpire: jest.fn().mockResolvedValue('OK'),
  pTTL: jest.fn().mockResolvedValue(60000), // Връща число (TTL в ms)
};

jest.mock('./config/redis', () => mockRedis)

// Увеличи timeout за async тестове
jest.setTimeout(10000);