/**
 * Server initialization file
 * Loads environment variables, starts the Express server,
 * and handles process events
 */
require("dotenv").config();
const app = require("./app");
const config = require("./config");
const {
  initializeConnectionPool,
  closeAllConnections,
} = require("./models/db");
const { initializeSchema } = require("./models/schema");

const PORT = config.port;
let server;

// Initialize database and start the server
async function startServer() {
  try {
    // Initialize database connection pool
    await initializeConnectionPool();

    // Initialize database schema
    await initializeSchema();

    // Start the server
    server = app.listen(PORT, () => {
      console.log(`Server running in ${config.env} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();

/**
 * Global error handlers for process-level errors
 * These catch errors that aren't handled by Express error middleware
 */

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);

  // Log to error monitoring service in production
  if (config.env === "production") {
    // TODO: Add error reporting service integration
    // Example: Sentry.captureException(err);
  }

  // Gracefully close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
// Note: This should be at the top of the file ideally, but we're keeping it here for readability
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);

  // Log to error monitoring service in production
  if (config.env === "production") {
    // TODO: Add error reporting service integration
    // Example: Sentry.captureException(err);
  }

  // For uncaught exceptions, we exit immediately as the application is in an undefined state
  process.exit(1);
});

// Handle SIGTERM signal (e.g., from Heroku, Kubernetes)
process.on("SIGTERM", async () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(async () => {
    // Close all database connections
    await closeAllConnections();
    console.log("💥 Process terminated!");
  });
});

// Handle SIGINT signal (e.g., Ctrl+C)
process.on("SIGINT", async () => {
  console.log("👋 SIGINT RECEIVED. Shutting down gracefully");
  server.close(async () => {
    // Close all database connections
    await closeAllConnections();
    console.log("💥 Process terminated!");
  });
});
