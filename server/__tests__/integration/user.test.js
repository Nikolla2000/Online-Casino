const request = require('supertest');
const app = require('../../app');
jest.mock('../../models/User.model');
const User = require('../../models/User.model');
jest.mock('../../models/Blocking.model');
const Blocking = require('../../models/Blocking.model');
const userService = require('../../services/userService');
const { generateTestToken } = require('../setup/testHelpers');

User.findOne = jest.fn();
User.create = jest.fn();
User.findByIdAndUpdate = jest.fn();
User.findById = jest.fn();
Blocking.create = jest.fn();
Blocking.findOneAndDelete = jest.fn();

jest.spyOn(userService, 'getUsers');

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

  describe('GET /server/v2/users', () => {
    it('should return list of all users', async () => {
      const token = generateTestToken('user123');
      
      const mockUsers = [
        { _id: '1', username: 'user1', totalCredits: 1000, isOnline: true },
        { _id: '2', username: 'user2', totalCredits: 500, isOnline: false }
      ];

      userService.getUsers.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/server/v2/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.users).toHaveLength(2);
      expect(userService.getUsers).toHaveBeenCalledWith({
        onlineOnly: false,
        vipOnly: false,
        limit: undefined,
        sortBy: 'username'
      });
    });

    it('should filter online users only', async () => {
      const token = generateTestToken('user123');
      
      const mockOnlineUsers = [
        { _id: '1', username: 'online_user', isOnline: true }
      ];

      userService.getUsers.mockResolvedValue(mockOnlineUsers);

      const response = await request(app)
        .get('/server/v2/users?online=true')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ onlineOnly: true })
      );
    });

    it('should filter VIP users only', async () => {
      const token = generateTestToken('user123');
      
      const mockVipUsers = [
        { _id: '1', username: 'vip_user', isVip: true }
      ];

      userService.getUsers.mockResolvedValue(mockVipUsers);

      const response = await request(app)
        .get('/server/v2/users?vip=true')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ vipOnly: true })
      );
    });

    it('should limit number of results', async () => {
      const token = generateTestToken('user123');
      
      userService.getUsers.mockResolvedValue([
        { _id: '1', username: 'user1' }
      ]);

      const response = await request(app)
        .get('/server/v2/users?limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5 })
      );
    });

    it('should sort by specified field', async () => {
      const token = generateTestToken('user123');
      
      userService.getUsers.mockResolvedValue([]);

      const response = await request(app)
        .get('/server/v2/users?sort=totalCredits')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'totalCredits' })
      );
    });

    it('should combine multiple filters', async () => {
      const token = generateTestToken('user123');
      
      userService.getUsers.mockResolvedValue([]);

      const response = await request(app)
        .get('/server/v2/users?online=true&vip=true&limit=10&sort=lastSeen')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(userService.getUsers).toHaveBeenCalledWith({
        onlineOnly: true,
        vipOnly: true,
        limit: 10,
        sortBy: 'lastSeen'
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/server/v2/users');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /server/v2/users/:userId/block', () => {
    it('should block user successfully', async () => {
      const token = generateTestToken('user123');
      
      User.findById.mockResolvedValue({
        _id: 'user456',
        username: 'target_user'
      });
      
      Blocking.create.mockResolvedValue({
        blockerId: 'user123',
        blockedId: 'user456'
      });

      const response = await request(app)
        .post('/server/v2/users/user456/block')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User is blocked');
      expect(Blocking.create).toHaveBeenCalledWith({
        blockerId: 'user123',
        blockedId: 'user456'
      });
    });

    it('should return 400 when trying to block yourself', async () => {
      const token = generateTestToken('user123');

      const response = await request(app)
        .post('/server/v2/users/user123/block')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("can't block yourself");
      expect(Blocking.create).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      const token = generateTestToken('user123');
      
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/server/v2/users/nonexistent/block')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
      expect(Blocking.create).not.toHaveBeenCalled();
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .post('/server/v2/users/user456/block');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /server/v2/users/:userId/block', () => {
    it('should unblock user successfully', async () => {
      const token = generateTestToken('user123');
      
      Blocking.findOneAndDelete.mockResolvedValue({
        blockerId: 'user123',
        blockedId: 'user456'
      });

      const response = await request(app)
        .delete('/server/v2/users/user456/block')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User is unblocked');
      expect(Blocking.findOneAndDelete).toHaveBeenCalledWith({
        blockerId: 'user123',
        blockedId: 'user456'
      });
    });

    it('should return 404 when user is not blocked', async () => {
      const token = generateTestToken('user123');
      
      Blocking.findOneAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/server/v2/users/user456/block')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("can't be unblocked");
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .delete('/server/v2/users/user456/block');

      expect(response.status).toBe(401);
    });
  });
})