/**
 * Custom error classes for the application
 * These classes extend the base Error class to provide additional functionality
 */

/**
 * Base application error class
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Indicates this is an operational error we're expecting

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found error - 404
 * @extends AppError
 */
class NotFoundError extends AppError {
  /**
   * Create a new NotFoundError
   * @param {string} message - Error message
   */
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Bad Request error - 400
 * @extends AppError
 */
class BadRequestError extends AppError {
  /**
   * Create a new BadRequestError
   * @param {string} message - Error message
   */
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

/**
 * Unauthorized error - 401
 * @extends AppError
 */
class UnauthorizedError extends AppError {
  /**
   * Create a new UnauthorizedError
   * @param {string} message - Error message
   */
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

/**
 * Forbidden error - 403
 * @extends AppError
 */
class ForbiddenError extends AppError {
  /**
   * Create a new ForbiddenError
   * @param {string} message - Error message
   */
  constructor(message = "Forbidden access") {
    super(message, 403);
  }
}

/**
 * Validation error - 422
 * @extends AppError
 */
class ValidationError extends AppError {
  /**
   * Create a new ValidationError
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors object
   */
  constructor(message = "Validation failed", errors = {}) {
    super(message, 422);
    this.errors = errors;
  }
}

/**
 * Database error - 500
 * @extends AppError
 */
class DatabaseError extends AppError {
  /**
   * Create a new DatabaseError
   * @param {string} message - Error message
   */
  constructor(message = "Database error occurred") {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  DatabaseError,
};
