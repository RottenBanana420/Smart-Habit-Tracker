/**
 * Authentication middleware
 * Handles JWT token validation and user authentication
 */
const jwt = require("jsonwebtoken");
const config = require("../config");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 * Sets req.user if token is valid
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function authenticateToken(req, res, next) {
  // Get authorization header
  const authHeader = req.headers["authorization"];

  // Check if header exists and has the right format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authentication token is required"));
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("Authentication token is required"));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Set user info in request object
    req.user = decoded;

    // Continue to next middleware
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Authentication token expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid authentication token"));
    }
    // For any other error
    return next(new UnauthorizedError("Authentication failed"));
  }
}

/**
 * Middleware to check if user has required role
 * Must be used after authenticateToken middleware
 *
 * @param {string|string[]} roles - Required role(s) to access the route
 * @returns {Function} - Express middleware function
 */
function requireRole(roles) {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    // Convert single role to array for consistent handling
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    // Check if user has any of the required roles
    if (
      req.user.roles &&
      Array.isArray(req.user.roles) &&
      req.user.roles.some((role) => requiredRoles.includes(role))
    ) {
      return next();
    }

    // User doesn't have required role
    return next(new ForbiddenError("Insufficient permissions"));
  };
}

/**
 * Utility function to create a protected route
 * Combines authenticateToken with optional role check
 *
 * @param {string|string[]} [roles] - Optional role(s) required to access the route
 * @returns {Function[]} - Array of middleware functions
 */
function protectedRoute(roles) {
  return roles ? [authenticateToken, requireRole(roles)] : [authenticateToken];
}

module.exports = {
  authenticateToken,
  requireRole,
  protectedRoute,
};
