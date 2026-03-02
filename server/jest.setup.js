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
  incr: jest.fn().mockResolvedValue(1),
  decr: jest.fn().mockResolvedValue(0),
  pExpire: jest.fn().mockResolvedValue('OK'),
  pTTL: jest.fn().mockResolvedValue(60000),
};

jest.mock('./config/redis', () => mockRedis)

jest.setTimeout(10000);