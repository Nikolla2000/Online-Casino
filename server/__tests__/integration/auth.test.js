const app = require('../../app');
const User = require('../../models/User.model');
const request = require('supertest');
const { comparePasswords } = require('../../helpers/auth');
const redis = require('../../config/redis');

jest.mock('../../models/User.model');
jest.mock('../../helpers/auth');

describe('Auth Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /server/v1/auth/login', () => {
        it('should login with valid credentials', async () => {
            const mockUser = {
                _id: '123',
                username: 'chicho_mitko5',
                email: 'test@example.com',
                password: 'hashedPassword123',
                refreshToken: null,
                isOnline: false,
                lastSeen: null,
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            comparePasswords.mockResolvedValue(true);

            const response = await request(app)
                .post('/server/v1/auth/login')
                .send({
                    username: 'chicho_mitko5',
                    password: 'somePasswordJh?'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(User.findOne).toHaveBeenCalledWith({ username: 'chicho_mitko5' });
            expect(comparePasswords).toHaveBeenCalledWith('somePasswordJh?', 'hashedPassword123');
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockUser.isOnline).toBe(true);
            expect(mockUser.refreshToken).toBeDefined();
        });

        it ('should return 401 with invalid password', async () => {
            const mockUser = {
                _id: '123',
                username: 'chicho_mitko5',
                email: 'test@example.com',
                password: 'hashedPassword123',
                refreshToken: null,
                isOnline: false,
                lastSeen: null,
                save: jest.fn()
            };

            User.findOne.mockResolvedValue(mockUser);
            comparePasswords.mockResolvedValue(false);

            const response = await request(app)
                .post('/server/v1/auth/login')
                .send({
                    username: 'chicho_mitko5',
                    password: 'wrongpassworrd'
                });

            expect(response.status).toBe(401);
            expect(mockUser.save).not.toHaveBeenCalled();
        });

        it ('should return 400 when username or password is missing', async () => {
            const response = await request(app)
                .post('/server/v1/auth/login')
                .send({
                    username: 'chicho_mitko5'
                });

                expect(response.status).toBe(400);
        })
    })
})