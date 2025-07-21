/**
 * Test utilities and helpers
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../src/config");
const { initializeSchema, resetDatabase } = require("../../src/models/schema");
const { withConnection } = require("../../src/models/db");

/**
 * Create a test user in the database
 * @param {Object} userData - User data (optional)
 * @returns {Promise<Object>} Created user object
 */
async function createTestUser(userData = {}) {
  const defaultUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: await bcrypt.hash("password123", 10),
    roles: ["user"],
  };

  const user = { ...defaultUser, ...userData };

  return await withConnection(async (db) => {
    const result = await db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [user.username, user.email, user.password]
    );

    user.id = result.lastID;
    return user;
  });
}

/**
 * Generate a test JWT token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateTestToken(user = {}) {
  const defaultUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    roles: ["user"],
  };

  const payload = { ...defaultUser, ...user };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: "1h",
  });
}

/**
 * Initialize test database
 * @returns {Promise<void>}
 */
async function initTestDatabase() {
  await resetDatabase();
}

/**
 * Create a test habit in the database
 * @param {Object} habitData - Habit data
 * @returns {Promise<Object>} Created habit object
 */
async function createTestHabit(habitData) {
  const defaultHabit = {
    user_id: 1,
    name: `Test Habit ${Date.now()}`,
    description: "Test habit description",
    frequency: "daily",
    start_date: new Date().toISOString().split("T")[0],
  };

  const habit = { ...defaultHabit, ...habitData };

  return await withConnection(async (db) => {
    const result = await db.run(
      `INSERT INTO habits (user_id, name, description, frequency, start_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        habit.user_id,
        habit.name,
        habit.description,
        habit.frequency,
        habit.start_date,
      ]
    );

    habit.id = result.lastID;
    return habit;
  });
}

/**
 * Create a test habit log in the database
 * @param {Object} logData - Habit log data
 * @returns {Promise<Object>} Created habit log object
 */
async function createTestHabitLog(logData) {
  const today = new Date().toISOString().split("T")[0];

  const defaultLog = {
    habit_id: 1,
    date: today,
    completed: true,
    notes: "Test log notes",
  };

  const log = { ...defaultLog, ...logData };

  return await withConnection(async (db) => {
    const result = await db.run(
      `INSERT INTO habit_logs (habit_id, date, completed, notes) 
       VALUES (?, ?, ?, ?)`,
      [log.habit_id, log.date, log.completed ? 1 : 0, log.notes]
    );

    log.id = result.lastID;
    return log;
  });
}

/**
 * Clear all test data from the database
 * @returns {Promise<void>}
 */
async function clearTestData() {
  await withConnection(async (db) => {
    await db.run("DELETE FROM habit_logs");
    await db.run("DELETE FROM habits");
    await db.run("DELETE FROM users");
  });
}

module.exports = {
  createTestUser,
  generateTestToken,
  initTestDatabase,
  createTestHabit,
  createTestHabitLog,
  clearTestData,
};
