/**
 * Test database configuration
 */
const {
  initializeConnectionPool,
  closeAllConnections,
} = require("../../src/models/db");
const { initializeSchema, resetDatabase } = require("../../src/models/schema");

/**
 * Setup test database
 * @returns {Promise<void>}
 */
async function setupTestDb() {
  try {
    // Initialize connection pool
    await initializeConnectionPool();

    // Reset and initialize schema
    await resetDatabase();

    console.log("Test database setup complete");
  } catch (error) {
    console.error("Test database setup failed:", error);
    throw error;
  }
}

/**
 * Teardown test database
 * @returns {Promise<void>}
 */
async function teardownTestDb() {
  try {
    // Close all database connections (this will also clear the idle connection timer)
    await closeAllConnections();

    // Add a small delay to ensure all async operations complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Test database teardown complete");
  } catch (error) {
    console.error("Test database teardown failed:", error);
    throw error;
  }
}

module.exports = {
  setupTestDb,
  teardownTestDb,
};
