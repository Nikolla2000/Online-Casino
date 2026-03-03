// userController.test.js - само registerUserV2 за да тестваме
const { registerUserV2 } = require('../../../controllers/User.controller');
const userService = require('../../../services/userService');

jest.mock('../../../services/userService');

describe('User Controller - registerUserV2', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        
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


    // it('should handle service errors', async () => {
    //     const { ConflictError } = require('../../../helpers/errors');
    //     const error = new ConflictError('Email already exists');
        
    //     userService.register.mockRejectedValue(error);

    //     await registerUserV2(req, res);

    //     expect(req.next).toHaveBeenCalledWith(error);
    //     expect(res.status).not.toHaveBeenCalled();
    //     expect(res.json).not.toHaveBeenCalled();
    // });
});