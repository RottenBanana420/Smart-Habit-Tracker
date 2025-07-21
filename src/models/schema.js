/**
 * Database schema initialization script
 * Creates tables and indexes if they don't exist
 */
const { withConnection } = require("./db");
const { DatabaseError } = require("../utils/errors");

/**
 * Initialize the database schema
 * @returns {Promise<void>}
 */
async function initializeSchema() {
  try {
    await withConnection(async (db) => {
      // Enable foreign keys
      await db.exec("PRAGMA foreign_keys = ON");

      // Create users table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create habits table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS habits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          frequency TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Create habit_logs table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS habit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          habit_id INTEGER NOT NULL,
          date DATE NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
          UNIQUE(habit_id, date)
        )
      `);

      // Create indexes for better query performance
      await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
        CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
        CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
      `);

      console.log("Database schema initialized successfully");
    });
  } catch (error) {
    console.error("Failed to initialize database schema:", error);
    throw new DatabaseError(`Schema initialization failed: ${error.message}`);
  }
}

/**
 * Reset the database (for testing purposes)
 * @returns {Promise<void>}
 */
async function resetDatabase() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Database reset is only allowed in test environment");
  }

  try {
    await withConnection(async (db) => {
      // Drop tables in reverse order of dependencies
      await db.exec("DROP TABLE IF EXISTS habit_logs");
      await db.exec("DROP TABLE IF EXISTS habits");
      await db.exec("DROP TABLE IF EXISTS users");

      // Reinitialize schema
      await initializeSchema();
    });

    console.log("Database reset successfully");
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw new DatabaseError(`Database reset failed: ${error.message}`);
  }
}

module.exports = {
  initializeSchema,
  resetDatabase,
};
