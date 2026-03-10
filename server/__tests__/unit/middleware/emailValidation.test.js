const { validateEmail } = require('../../../middleware/emailValidation');

describe('validateEmail Middleware', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
  });

  describe('Email validation', () => {
    it('should return error if email is missing', () => {
      mockRequest.body = {
        firstName: 'John',
        message: 'This is a test message with at least 10 chars'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Email is required']
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error if email is invalid format', () => {
      mockRequest.body = {
        email: 'invalid-email',
        firstName: 'John',
        message: 'This is a test message with at least 10 chars'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Email is invalid']
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com',
        '123@test.com',
        'email@subdomain.example.com'
      ];

      validEmails.forEach(email => {
        mockRequest.body = {
          email: email,
          firstName: 'John',
          message: 'This is a test message with at least 10 chars'
        };

        validateEmail(mockRequest, mockResponse, mockNext);
        
        expect(mockNext).toHaveBeenCalled();
        mockNext.mockClear();
      });
    });
  });

  describe('Message validation', () => {
    it('should return error if message is missing', () => {
      mockRequest.body = {
        email: 'test@example.com',
        firstName: 'John'
        // no message
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Message is required']
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error if message is too short', () => {
      mockRequest.body = {
        email: 'test@example.com',
        firstName: 'John',
        message: 'too short'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Message must be at least 10 characters long']
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept message with exactly 10 characters', () => {
      mockRequest.body = {
        email: 'test@example.com',
        firstName: 'John',
        message: '1234567890'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should accept message longer than 10 characters', () => {
      mockRequest.body = {
        email: 'test@example.com',
        firstName: 'John',
        message: 'This is a very long message that exceeds the minimum length requirement'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('First name validation', () => {
    it('should return error if firstName is missing', () => {
      mockRequest.body = {
        email: 'test@example.com',
        message: 'This is a test message with at least 10 chars'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: ['First name is required']
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept any firstName (no length validation)', () => {
      mockRequest.body = {
        email: 'test@example.com',
        firstName: 'J',
        message: 'This is a test message with at least 10 chars'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('Multiple validation errors', () => {
    it('should return all missing fields errors', () => {
      mockRequest.body = {};

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          'Email is required',
          'Message is required',
          'First name is required'
        ])
      });
      expect(mockResponse.json.mock.calls[0][0].errors.length).toBe(3);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return both email format and message length errors', () => {
      mockRequest.body = {
        email: 'invalid',
        firstName: 'John',
        message: 'short'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          'Email is invalid',
          'Message must be at least 10 characters long'
        ])
      });
      expect(mockResponse.json.mock.calls[0][0].errors.length).toBe(2);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Successful validation', () => {
    it('should call next() when all fields are valid', () => {
      mockRequest.body = {
        email: 'test@example.com',
        firstName: 'John',
        message: 'This is a valid message with sufficient length'
      };

      validateEmail(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});