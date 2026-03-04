const request = require('supertest');
const app = require('../../app');
jest.mock('../../models/User.model');
const User = require('../../models/User.model');
const { generateTestToken } = require('../setup/testHelpers');

User.findOne = jest.fn();
User.create = jest.fn();
User.findByIdAndUpdate = jest.fn();


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
    });

    it('should return 400 for password mismatch', async() => {
    const response = await request(app)
      .post('/server/v2/users/register')
      .send({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: '123123testFf!',
        confirmPassword: 'DifferentPassword!'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });

    it('should return 400 for invalid email format', async() => {
    const response = await request(app)
      .post('/server/v2/users/register')
      .send({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'not-an-email',
        password: '123123testFf!',
        confirmPassword: '123123testFf!'
      });

    expect(response.status).toBe(400);
  });
  });

  

  describe('PATCH /server/v1/user/notification-preferences', () => {
    it('should update preferences successfully', async () => {
        const token = generateTestToken('user123');
        
        User.findByIdAndUpdate.mockResolvedValue({});

        const response = await request(app)
            .patch('/server/v1/user/notification-preferences')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bonusOffers: true,
                gameUpdates: false,
                vipEvents: true
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should return 400 for invalid data types', async () => {
        const token = generateTestToken('user123');

        const response = await request(app)
            .patch('/server/v1/user/notification-preferences')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bonusOffers: 'true',
                gameUpdates: false
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Invalid data format');
    });

    it('should update only bonusOffers field', async () => {
      const token = generateTestToken('user123');
      
      User.findByIdAndUpdate.mockResolvedValue({});

      const response = await request(app)
        .patch('/server/v1/user/notification-preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bonusOffers: true
        });

      expect(response.status).toBe(200);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { bonusOffers: true }
      );
    });

    it('should handle all three preferences together', async () => {
      const token = generateTestToken('user123');
      
      User.findByIdAndUpdate.mockResolvedValue({});

      const response = await request(app)
        .patch('/server/v1/user/notification-preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bonusOffers: false,
          gameUpdates: true,
          vipEvents: false
        });

      expect(response.status).toBe(200);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        {
          bonusOffers: false,
          gameUpdates: true,
          vipEvents: false
        }
      );
    });

  })
})