const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User.model');

jest.mock('../../models/User.model', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

describe('User endpoints', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /server/v2/users/register', () => {
    it('should send back a 400 status if email is already used', async() => {
      const mockExistingUser = {
        _id: 'some-id',
        username: 'testuser',
        email: 'testmail@gmail.com'
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockExistingUser)
      });
      
      const response = await request(app)
        .post('/server/v2/users/register')
        .send({
          username: 'mitko_mitkov',
          firstName: 'Mitko',
          lastName: 'Mitkov',
          email: 'testmail@gmail.com',
          password: '123123testFf!',
          confirmPassword: '123123testFf!'
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(409);
    });
  });

  it('should register a new user', async() => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const mockCreatedUser = {
      _id: 'new-user-id',
      username: 'mitko_mitkov',
      firstName: 'Mitko',
      lastName: 'Mitkov',
      email: 'mitko@gmail.com',
      toObject: () => ({
        _id: 'new-user-id',
        username: 'mitko_mitkov',
        firstName: 'Mitko',
        lastName: 'Mitkov',
        email: 'newemail@gmail.com',
        password: 'hashedpassword',
        __v: 0
      })
    };

    User.create.mockResolvedValue(mockCreatedUser);

    const response = await request(app)
      .post('/server/v2/users/register')
      .send({
        username: 'mitko_mitkov',
        firstName: 'Mitko',
        lastName: 'Mitkov',
        email: 'newemail@gmail.com',
        password: '123123testFf!',
        confirmPassword: '123123testFf!'
      })
      .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
  })
})