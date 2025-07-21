/**
 * Central error handling middleware
 * Processes all errors and sends appropriate responses
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Default to 500 internal server error if statusCode not set
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error details
  console.error(`[Error] ${statusCode}: ${message}`);

  // Only log stack trace for server errors or in development
  if (statusCode >= 500 || process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Prepare error response
  const errorResponse = {
    status: err.status || "error",
    message,
    // Include additional error details if available
    ...(err.errors && { errors: err.errors }),
    // Include stack trace in development mode only
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  // Handle specific error types
  if (err.name === "ValidationError" && !err.statusCode) {
    // Handle mongoose/validation library validation errors
    errorResponse.status = "fail";
    errorResponse.message = "Validation failed";
    errorResponse.errors = err.errors || {};
    return res.status(422).json(errorResponse);
  }

  if (err.name === "SyntaxError" && err.message.includes("JSON")) {
    // Handle JSON parsing errors
    errorResponse.status = "fail";
    errorResponse.message = "Invalid JSON";
    return res.status(400).json(errorResponse);
  }

  if (err.code === "SQLITE_CONSTRAINT") {
    // Handle SQLite constraint errors
    errorResponse.status = "fail";
    errorResponse.message = "Database constraint violation";
    return res.status(400).json(errorResponse);
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
}

// Import custom error classes from utils/errors
const { AppError } = require("../utils/errors");

module.exports = { errorHandler, AppError };
