const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Import and use other route modules here
// Example: router.use("/auth", require("./auth"));

module.exports = router;
