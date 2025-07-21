/**
 * Database Connection Module
 *
 * This module manages SQLite database connections with a connection pooling mechanism
 * to improve performance and resource utilization. It handles connection creation,
 * pooling, and cleanup of idle connections.
 *
 * Key features:
 * - Connection pooling with configurable pool size
 * - Automatic cleanup of idle connections
 * - Connection reuse to reduce overhead
 * - Proper error handling and reporting
 * - WAL journal mode in production for better performance
 */
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const config = require("../config");
const { DatabaseError } = require("../utils/errors");

// Connection pool settings
const POOL_SIZE = process.env.DB_POOL_SIZE || 5;
const IDLE_TIMEOUT = process.env.DB_IDLE_TIMEOUT || 30000; // 30 seconds

// Connection pool
let connectionPool = [];
let poolInitialized = false;

/**
 * Initialize the database connection pool
 *
 * Creates a pool of database connections that can be reused across requests.
 * This significantly improves performance by avoiding the overhead of creating
 * new connections for each database operation. The pool size is configurable
 * through the DB_POOL_SIZE environment variable.
 *
 * The function is idempotent - calling it multiple times will only initialize
 * the pool once.
 *
 * @returns {Promise<void>}
 * @throws {DatabaseError} If pool initialization fails
 */
async function initializeConnectionPool() {
  if (poolInitialized) return;

  try {
    // Create connections up to pool size
    for (let i = 0; i < POOL_SIZE; i++) {
      const connection = await createConnection();
      connectionPool.push({
        connection,
        inUse: false,
        lastUsed: Date.now(),
      });
    }

    poolInitialized = true;
    console.log(
      `Database connection pool initialized with ${POOL_SIZE} connections`
    );

    // Start the idle connection manager
    manageIdleConnections();
  } catch (error) {
    console.error("Failed to initialize connection pool:", error);
    throw new DatabaseError("Database connection pool initialization failed");
  }
}

/**
 * Create a new SQLite database connection
 *
 * Establishes a new connection to the SQLite database and configures it with
 * optimal settings. In production, it uses Write-Ahead Logging (WAL) journal mode
 * and NORMAL synchronous setting for better performance while maintaining data integrity.
 *
 * The function also enables foreign key constraints and sets a busy timeout to
 * handle concurrent access scenarios.
 *
 * @returns {Promise<Object>} Configured SQLite database connection
 * @throws {DatabaseError} If connection creation fails
 */
async function createConnection() {
  try {
    // Ensure the directory exists for the database file
    const dbPath = path.resolve(config.db.path);

    // Create and configure the database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Enable foreign keys
    await db.exec("PRAGMA foreign_keys = ON");

    // Set busy timeout to avoid SQLITE_BUSY errors
    await db.exec(`PRAGMA busy_timeout = 5000`);

    // Optimize for better performance
    if (config.env === "production") {
      await db.exec("PRAGMA journal_mode = WAL");
      await db.exec("PRAGMA synchronous = NORMAL");
    }

    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new DatabaseError(`Failed to connect to database: ${error.message}`);
  }
}

/**
 * Get a database connection from the pool
 *
 * Retrieves an available connection from the pool or creates a new one if all
 * connections are in use. This implements a dynamic pool that can grow beyond
 * the initial pool size during high load and shrink back during idle periods.
 *
 * Connections created beyond the pool size (extra connections) are marked and
 * will be closed after they become idle to prevent resource leakage.
 *
 * @returns {Promise<Object>} SQLite database connection ready for use
 * @throws {DatabaseError} If connection retrieval fails
 */
async function getConnection() {
  if (!poolInitialized) {
    await initializeConnectionPool();
  }

  // Find an available connection
  const availableConnection = connectionPool.find((conn) => !conn.inUse);

  if (availableConnection) {
    availableConnection.inUse = true;
    availableConnection.lastUsed = Date.now();
    return availableConnection.connection;
  }

  // If no connections are available, create a new one (beyond pool size)
  console.warn("Connection pool exhausted, creating additional connection");
  const newConnection = await createConnection();

  const connObj = {
    connection: newConnection,
    inUse: true,
    lastUsed: Date.now(),
    isExtra: true, // Mark as extra connection to be closed later
  };

  connectionPool.push(connObj);
  return newConnection;
}

/**
 * Release a connection back to the pool
 *
 * Marks a connection as available for reuse after an operation is complete.
 * For connections that were created beyond the pool size (extra connections),
 * this function will close them if there are enough idle connections in the pool.
 *
 * This helps maintain the optimal pool size and prevents resource leakage
 * during periods of varying load.
 *
 * @param {Object} connection - The database connection to release back to the pool
 */
function releaseConnection(connection) {
  const connIndex = connectionPool.findIndex(
    (conn) => conn.connection === connection
  );

  if (connIndex !== -1) {
    const connObj = connectionPool[connIndex];
    connObj.inUse = false;
    connObj.lastUsed = Date.now();

    // If this is an extra connection and we have enough idle connections, close it
    if (
      connObj.isExtra &&
      connectionPool.filter((c) => !c.inUse).length > POOL_SIZE
    ) {
      connection.close();
      connectionPool.splice(connIndex, 1);
    }
  }
}

/**
 * Manage idle connections in the pool
 *
 * Periodically checks for and closes idle extra connections that exceed the
 * configured idle timeout. This prevents resource leakage and ensures the
 * connection pool stays at an optimal size.
 *
 * This function sets up an interval timer that runs every IDLE_TIMEOUT milliseconds
 * to clean up unused connections.
 *
 * @returns {Object} The interval timer that can be cleared when needed
 */
let idleConnectionTimer = null;

function manageIdleConnections() {
  // Clear any existing timer to avoid duplicates
  if (idleConnectionTimer) {
    clearInterval(idleConnectionTimer);
  }

  idleConnectionTimer = setInterval(() => {
    const now = Date.now();

    // Close idle extra connections
    connectionPool = connectionPool.filter((conn) => {
      if (!conn.inUse && conn.isExtra && now - conn.lastUsed > IDLE_TIMEOUT) {
        conn.connection.close();
        return false;
      }
      return true;
    });
  }, IDLE_TIMEOUT);

  // Ensure the timer doesn't keep the process alive
  idleConnectionTimer.unref();

  return idleConnectionTimer;
}

/**
 * Execute a database operation with a connection from the pool
 *
 * This is the main function that should be used for all database operations.
 * It automatically handles getting a connection from the pool, executing the
 * operation, and releasing the connection back to the pool when done.
 *
 * The function ensures proper resource management even if the operation throws
 * an exception by using try/finally.
 *
 * Usage example:
 * ```
 * const result = await withConnection(async (db) => {
 *   return await db.all('SELECT * FROM users WHERE active = ?', [true]);
 * });
 * ```
 *
 * @param {Function} operation - Function that takes a db connection and performs operations
 * @returns {Promise<any>} Result of the operation
 * @throws {Error} Rethrows any error from the operation
 */
async function withConnection(operation) {
  const connection = await getConnection();
  try {
    return await operation(connection);
  } finally {
    releaseConnection(connection);
  }
}

/**
 * Close all database connections in the pool
 *
 * Properly shuts down all database connections in the pool. This should be called
 * when the application is shutting down to ensure all resources are properly released.
 *
 * The function attempts to close each connection individually and logs any errors
 * that occur during the process, but continues closing the remaining connections.
 * It also clears any active timers to prevent memory leaks.
 *
 * @returns {Promise<void>}
 * @throws {DatabaseError} If there's a critical error during the shutdown process
 */
async function closeAllConnections() {
  try {
    // Clear the idle connection timer if it exists
    if (idleConnectionTimer) {
      clearInterval(idleConnectionTimer);
      idleConnectionTimer = null;
    }

    await Promise.all(
      connectionPool.map(async (conn) => {
        try {
          await conn.connection.close();
        } catch (error) {
          console.error("Error closing connection:", error);
        }
      })
    );

    connectionPool = [];
    poolInitialized = false;
    console.log("All database connections closed");
  } catch (error) {
    console.error("Error closing database connections:", error);
    throw new DatabaseError("Failed to close database connections");
  }
}

module.exports = {
  initializeConnectionPool,
  withConnection,
  closeAllConnections,
  // Export for testing purposes
  _getIdleConnectionTimer: () => idleConnectionTimer,
};
