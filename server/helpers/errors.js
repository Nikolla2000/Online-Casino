// utils/errors.js

const { AppError } = require("../middleware/errorHandler");

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

class TokenExpiredError extends AppError {
  constructor(message = 'Token expired') {
    super(message, 403);
  }
}

class InvalidTokenError extends AppError {
  constructor(message = 'Invalid token') {
    super(message, 403);
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  TokenExpiredError,
  InvalidTokenError,
};