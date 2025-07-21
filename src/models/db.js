/**
 * Database connection module
 * Manages SQLite database connections with connection pooling
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
 * Initialize the connection pool
 * @returns {Promise<void>}
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
 * Create a new database connection
 * @returns {Promise<Object>} SQLite database connection
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
 * Get a connection from the pool
 * @returns {Promise<Object>} SQLite database connection
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
 * @param {Object} connection - The connection to release
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
 */
function manageIdleConnections() {
  setInterval(() => {
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
}

/**
 * Execute a database operation with a connection from the pool
 * @param {Function} operation - Function that takes a db connection and performs operations
 * @returns {Promise<any>} Result of the operation
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
 * Close all database connections
 * @returns {Promise<void>}
 */
async function closeAllConnections() {
  try {
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
};
