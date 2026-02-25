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

            // User.findById.mockReturnValue({
            //     select: jest.fn().mockReturnThis(),
            //     lean: jest.fn().mockResolvedValue(mockUser)
            // });

            comparePasswords.mockResolvedValue(true);

            const response = await request(app)
                .post('/server/v1/auth/login')
                .send({
                    username: 'chicho_mitko5',
                    password: '123456Ff!'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
        })
    })
})