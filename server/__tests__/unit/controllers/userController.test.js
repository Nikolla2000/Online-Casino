// userController.test.js - само registerUserV2 за да тестваме
const { registerUserV2, getUsers, getUserProfile, getTotalCredits, blockUser } = require('../../../controllers/User.controller');
const userService = require('../../../services/userService');
const Blocking = require('../../../models/Blocking.model');
const User = require('../../../models/User.model');
const { ValidationError, NotFoundError } = require('../../../helpers/errors');

jest.mock('../../../services/userService');

describe('User Controller', () => {
    let req, res, next;

      beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
        userId: 'test-user-id',
        params: {},
        query: {},
        validatedData: { body: {} },
        next: jest.fn()
        };
        
        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };
        
        next = jest.fn();
    });

    describe('registerUserV2', () => {
    
        beforeEach(() => {
            // jest.clearAllMocks();
            
            req = {
                validatedData: {
                    body: {
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@test.com',
                        password: 'Password123!',
                        username: 'johndoe'
                    }
                },
                next: jest.fn()
            };
            
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        });
    
        it('should register user successfully', async () => {
            const mockNewUser = {
                _id: '123',
                username: 'johndoe',
                email: 'john@test.com'
            };
            
            userService.register.mockResolvedValue(mockNewUser);
    
            await registerUserV2(req, res);
    
            expect(userService.register).toHaveBeenCalledWith(req.validatedData.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User registered successfully',
                data: mockNewUser
            });
        });
    });

    describe('getUsers', () => {
        it('should return users with default parameters', async () => {
            const mockUsers = [
                { _id: '1', username: 'john', isOnline: true },
                { _id: '2', username: 'jane', isOnline: false }
            ];
            
            userService.getUsers.mockResolvedValue(mockUsers);
            req.query = {};

            await getUsers(req, res, next);

            expect(userService.getUsers).toHaveBeenCalledWith({
                onlineOnly: false,
                vipOnly: false,
                limit: undefined,
                sortBy: 'username'
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 2,
                users: mockUsers
            });
        });

        it('should apply online filter when online=true', async () => {
            const mockUsers = [{ _id: '1', username: 'john', isOnline: true }];
            userService.getUsers.mockResolvedValue(mockUsers);
            req.query = { online: 'true' };

            await getUsers(req, res, next);

            expect(userService.getUsers).toHaveBeenCalledWith({
                onlineOnly: true,
                vipOnly: false,
                limit: undefined,
                sortBy: 'username'
            });
        });

        it('should apply vip filter when vip=true', async () => {
            const mockUsers = [{ _id: '2', username: 'jane', isVip: true }];
            userService.getUsers.mockResolvedValue(mockUsers);
            req.query = { vip: 'true' };

            await getUsers(req, res, next);

            expect(userService.getUsers).toHaveBeenCalledWith({
                onlineOnly: false,
                vipOnly: true,
                limit: undefined,
                sortBy: 'username'
            });
            });

        it('should apply limit when provided', async () => {
            const mockUsers = [{ _id: '1', username: 'john' }];
            userService.getUsers.mockResolvedValue(mockUsers);
            req.query = { limit: '5' };

            await getUsers(req, res, next);

            expect(userService.getUsers).toHaveBeenCalledWith({
                onlineOnly: false,
                vipOnly: false,
                limit: 5,
                sortBy: 'username'
            });
        });
    });

    describe('getUserProfile', () => {
        it('should return user profile successfully', async () => {
            const mockUserProfile = {
                _id: 'target-user-id',
                username: 'johndoe',
                firstName: 'John',
                lastName: 'Doe',
                isBlocked: false
            };
            
            userService.getProfileById.mockResolvedValue(mockUserProfile);
            req.params = { userId: 'target-user-id' };
            req.userId = 'current-user-id';

            await getUserProfile(req, res, next);

            expect(userService.getProfileById).toHaveBeenCalledWith('target-user-id', 'current-user-id');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUserProfile);
        });

        it('should throw ValidationError when userId is missing', async () => {
            req.params = {};

            await getUserProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
            expect(userService.getProfileById).not.toHaveBeenCalled();
        });
    });

    describe('getTotalCredits', () => {
        it('should return user credits successfully', async () => {
            const mockCredits = { totalCredits: 5000 };
            userService.getTotalCredits.mockResolvedValue(mockCredits);
            req.params = { userId: 'target-user-id' };

            await getTotalCredits(req, res, next);

            expect(userService.getTotalCredits).toHaveBeenCalledWith('target-user-id');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCredits);
          });

      });
})
