/**
 * Tests for error handling middleware
 */
const {
  errorHandler,
  AppError,
} = require("../../../src/middleware/errorHandler");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  DatabaseError,
} = require("../../../src/utils/errors");

describe("Error Handler Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    // Mock request, response, and next function
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock console.error to avoid cluttering test output
    console.error = jest.fn();
  });

  it("should handle AppError with correct status code and message", () => {
    const error = new AppError("Test error", 400);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Test error",
      })
    );
  });

  it("should handle NotFoundError with 404 status code", () => {
    const error = new NotFoundError("Resource not found");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Resource not found",
      })
    );
  });

  it("should handle BadRequestError with 400 status code", () => {
    const error = new BadRequestError("Invalid request");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Invalid request",
      })
    );
  });

  it("should handle UnauthorizedError with 401 status code", () => {
    const error = new UnauthorizedError("Authentication required");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Authentication required",
      })
    );
  });

  it("should handle ForbiddenError with 403 status code", () => {
    const error = new ForbiddenError("Access denied");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Access denied",
      })
    );
  });

  it("should handle ValidationError with 422 status code and include errors object", () => {
    const validationErrors = { field: "Field is required" };
    const error = new ValidationError("Validation failed", validationErrors);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Validation failed",
        errors: validationErrors,
      })
    );
  });

  it("should handle DatabaseError with 500 status code", () => {
    const error = new DatabaseError("Database connection failed");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Database connection failed",
      })
    );
  });

  it("should handle generic Error with 500 status code", () => {
    const error = new Error("Something went wrong");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Something went wrong",
      })
    );
  });

  it("should handle SyntaxError for JSON parsing with 400 status code", () => {
    const error = new SyntaxError("Unexpected token in JSON at position 0");
    error.message = "Unexpected token in JSON at position 0";

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Invalid JSON",
      })
    );
  });

  it("should handle SQLite constraint errors with 400 status code", () => {
    const error = new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed");
    error.code = "SQLITE_CONSTRAINT";

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Database constraint violation",
      })
    );
  });

  it("should include stack trace in development environment", () => {
    // Save original NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;

    // Set NODE_ENV to development
    process.env.NODE_ENV = "development";

    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at Test.it";

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: error.stack,
      })
    );

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should not include stack trace in production environment", () => {
    // Save original NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;

    // Set NODE_ENV to production
    process.env.NODE_ENV = "production";

    const error = new Error("Test error");
    error.stack = "Error: Test error\n    at Test.it";

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.not.objectContaining({
        stack: error.stack,
      })
    );

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
});
