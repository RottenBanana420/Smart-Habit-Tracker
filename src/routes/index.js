/**
 * Main router file that combines all route modules
 */
const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { NotFoundError } = require("../utils/errors");
const authRoutes = require("./auth");
const { protectedRoute } = require("../middleware/auth");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  const config = require("../config");
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.env,
    database: {
      path: config.db.path,
    },
  });
});

// Mount authentication routes
router.use("/auth", authRoutes);

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

// Example of a protected route
router.get(
  "/protected",
  protectedRoute(),
  asyncHandler(async (req, res) => {
    res.json({
      message: "This is a protected route",
      user: req.user,
    });
  })
);

// Example of a role-protected route
router.get(
  "/admin",
  protectedRoute("admin"),
  asyncHandler(async (req, res) => {
    res.json({
      message: "This is an admin-only route",
      user: req.user,
    });
  })
);

// Catch 404 and forward to error handler
router.use("*", (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

module.exports = router;
