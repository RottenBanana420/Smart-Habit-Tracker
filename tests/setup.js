/**
 * Jest setup file
 * This file runs before each test file
 */

// Set the environment to test
process.env.NODE_ENV = "test";

// Set test JWT secret
process.env.JWT_SECRET = "test-jwt-secret";

// Use in-memory SQLite database for tests
process.env.TEST_DB_PATH = ":memory:";

// Set test port
process.env.TEST_PORT = "3001";

// Increase Jest timeout for async tests
jest.setTimeout(10000);

// Global beforeAll and afterAll hooks
beforeAll(async () => {
  // Any global setup that should run once before all tests
  console.log("Starting test suite");
});

afterAll(async () => {
  // Any global cleanup that should run once after all tests
  console.log("Test suite completed");

  // Ensure all timers are cleared
  const activeTimers = setTimeout(() => {}, 0);
  for (let i = 0; i < activeTimers; i++) {
    try {
      clearTimeout(i);
    } catch (e) {
      // Ignore errors from clearing non-existent timers
    }
  }

  // Add a small delay to ensure all async operations complete
  await new Promise((resolve) => setTimeout(resolve, 100)).catch(() => {});
});
