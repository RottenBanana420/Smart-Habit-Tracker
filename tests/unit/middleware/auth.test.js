/**
 * Tests for authentication middleware
 */
const jwt = require("jsonwebtoken");
const {
  authenticateToken,
  requireRole,
  protectedRoute,
} = require("../../../src/middleware/auth");
const {
  UnauthorizedError,
  ForbiddenError,
} = require("../../../src/utils/errors");
const config = require("../../../src/config");

// Mock config to use a test secret
jest.mock("../../../src/config", () => ({
  jwt: {
    secret: "test-secret",
    expiresIn: "1h",
  },
}));

describe("Authentication Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks before each test
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  describe("authenticateToken", () => {
    it("should return unauthorized error if no authorization header", () => {
      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: "Authentication token is required",
        })
      );
    });

    it("should return unauthorized error if authorization header has wrong format", () => {
      req.headers.authorization = "InvalidFormat token123";

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: "Authentication token is required",
        })
      );
    });

    it("should return unauthorized error if token is invalid", () => {
      req.headers.authorization = "Bearer invalid-token";

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: "Invalid authentication token",
        })
      );
    });

    it("should set req.user and call next if token is valid", () => {
      const user = { id: 1, username: "testuser" };
      const token = jwt.sign(user, config.jwt.secret);
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(req.user).toMatchObject(user);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("requireRole", () => {
    it("should return unauthorized error if user is not authenticated", () => {
      const middleware = requireRole("admin");
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
          message: "Authentication required",
        })
      );
    });

    it("should return forbidden error if user does not have required role", () => {
      req.user = { id: 1, username: "testuser", roles: ["user"] };

      const middleware = requireRole("admin");
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          message: "Insufficient permissions",
        })
      );
    });

    it("should call next if user has required role", () => {
      req.user = { id: 1, username: "testuser", roles: ["admin"] };

      const middleware = requireRole("admin");
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should call next if user has one of the required roles", () => {
      req.user = { id: 1, username: "testuser", roles: ["editor"] };

      const middleware = requireRole(["admin", "editor"]);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("protectedRoute", () => {
    it("should return array with only authenticateToken if no roles provided", () => {
      const middleware = protectedRoute();

      expect(middleware).toHaveLength(1);
      expect(middleware[0]).toBe(authenticateToken);
    });

    it("should return array with authenticateToken and requireRole if roles provided", () => {
      const middleware = protectedRoute("admin");

      expect(middleware).toHaveLength(2);
      expect(middleware[0]).toBe(authenticateToken);
      expect(typeof middleware[1]).toBe("function");
    });
  });
});
