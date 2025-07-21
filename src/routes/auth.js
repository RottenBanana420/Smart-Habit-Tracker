/**
 * Authentication routes
 * Handles user registration, login, and token refresh
 */
const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("../utils/authUtils");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      throw new BadRequestError("Username, email, and password are required");
    }

    // In a real implementation, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save user to database
    // 4. Generate token

    // For demonstration purposes:
    const hashedPassword = await hashPassword(password);

    // Mock user object (in real app, this would come from database)
    const user = {
      id: 1,
      username,
      email,
      roles: ["user"],
    };

    // Generate token
    const token = generateToken(user);

    // Return user info and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      token,
    });
  })
);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    // In a real implementation, you would:
    // 1. Find user by email in database
    // 2. Compare passwords
    // 3. Generate token if valid

    // For demonstration purposes:
    // Mock user lookup and password verification
    // In a real app, you would fetch this from the database
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: await hashPassword("password123"),
      roles: ["user"],
    };

    // Check if user exists and password is correct
    if (
      email !== mockUser.email ||
      !(await comparePassword(password, mockUser.password))
    ) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate token
    const token = generateToken({
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      roles: mockUser.roles,
    });

    // Return user info and token
    res.json({
      message: "Login successful",
      user: {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        roles: mockUser.roles,
      },
      token,
    });
  })
);

/**
 * @route GET /api/auth/me
 * @description Get current user info
 * @access Private
 */
router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // req.user is set by authenticateToken middleware
    res.json({
      message: "User info retrieved successfully",
      user: req.user,
    });
  })
);

/**
 * @route POST /api/auth/refresh
 * @description Refresh authentication token
 * @access Private
 */
router.post(
  "/refresh",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Generate new token
    const token = generateToken(req.user);

    res.json({
      message: "Token refreshed successfully",
      token,
    });
  })
);

module.exports = router;
