/**
 * Tests for authentication utilities
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateToken,
  hashPassword,
  comparePassword,
  verifyToken,
} = require("../../../src/utils/authUtils");
const config = require("../../../src/config");

// Mock config to use a test secret
jest.mock("../../../src/config", () => ({
  jwt: {
    secret: "test-jwt-secret",
    expiresIn: "1h",
  },
}));

describe("Authentication Utilities", () => {
  describe("generateToken", () => {
    it("should generate a valid JWT token with user data", () => {
      const user = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      const token = generateToken(user);

      // Verify the token is valid and contains expected data
      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded).toMatchObject({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: ["user"], // Default role
      });
    });

    it("should include user roles in the token payload", () => {
      const user = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        roles: ["admin", "editor"],
      };

      const token = generateToken(user);
      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded.roles).toEqual(["admin", "editor"]);
    });

    it("should use custom expiration time if provided", () => {
      const user = { id: 1, username: "testuser" };
      const options = { expiresIn: "15m" };

      const token = generateToken(user, options);
      const decoded = jwt.verify(token, config.jwt.secret);

      // Calculate expected expiration time (within a small margin of error)
      const now = Math.floor(Date.now() / 1000);
      const expectedExp = now + 15 * 60; // 15 minutes in seconds

      // Allow 5 seconds margin for test execution time
      expect(decoded.exp).toBeGreaterThan(expectedExp - 5);
      expect(decoded.exp).toBeLessThan(expectedExp + 5);
    });
  });

  describe("hashPassword", () => {
    it("should hash a password using bcrypt", async () => {
      const password = "password123";

      const hashedPassword = await hashPassword(password);

      // Verify it's a bcrypt hash
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);

      // Verify the hash works with bcrypt.compare
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it("should use the specified salt rounds", async () => {
      const password = "password123";
      const saltRounds = 8;

      const hashedPassword = await hashPassword(password, saltRounds);

      // Verify it's a bcrypt hash with the correct rounds
      expect(hashedPassword).toMatch(/^\$2[aby]\$08\$/);
    });

    it("should generate different hashes for the same password", async () => {
      const password = "password123";

      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await comparePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const password = "password123";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await comparePassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });
  });

  describe("verifyToken", () => {
    it("should return decoded payload for valid token", () => {
      const payload = { id: 1, username: "testuser" };
      const token = jwt.sign(payload, config.jwt.secret);

      const result = verifyToken(token);

      expect(result).toMatchObject(payload);
    });

    it("should return null for invalid token", () => {
      const result = verifyToken("invalid-token");

      expect(result).toBeNull();
    });

    it("should return null for expired token", () => {
      // Create a token that's already expired
      const payload = { id: 1, username: "testuser" };
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: "-1s" });

      const result = verifyToken(token);

      expect(result).toBeNull();
    });
  });
});
