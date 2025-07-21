/**
 * Main Express application file
 * Configures middleware, routes, and error handling
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet()); // Set security-related HTTP headers

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Configure as needed for production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging
app.use(morgan(config.env === "production" ? "combined" : "dev"));

// Body parsing middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// API Routes
app.use("/api", routes);

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;
