/**
 * Main router file that combines all route modules
 */
const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { NotFoundError } = require("../utils/errors");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Example of using asyncHandler and custom errors
router.get(
  "/example",
  asyncHandler(async (req, res) => {
    // This will be caught by asyncHandler and passed to the error middleware
    if (Math.random() > 0.5) {
      throw new NotFoundError("Example resource not found");
    }

    res.json({ message: "Example endpoint working correctly" });
  })
);

// Catch 404 and forward to error handler
router.use("*", (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

module.exports = router;
