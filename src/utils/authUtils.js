/**
 * Authentication utilities
 * Functions for token generation and password hashing
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Generate a JWT token for a user
 *
 * @param {Object} user - User object (without sensitive data like password)
 * @param {Object} options - Optional configuration
 * @param {string} options.expiresIn - Token expiration time (defaults to config value)
 * @returns {string} - JWT token
 */
function generateToken(user, options = {}) {
  // Extract only necessary user data for the token payload
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles || ["user"], // Default role if none specified
  };

  // Generate and return the token
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: options.expiresIn || config.jwt.expiresIn,
  });
}

/**
 * Hash a password using bcrypt
 *
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 12)
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password, saltRounds = 12) {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 *
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Verify a JWT token
 *
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  verifyToken,
};
