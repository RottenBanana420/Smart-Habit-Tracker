/**
 * Wraps async route handlers to automatically catch errors and pass them to the next middleware
 * @param {Function} fn - The async route handler function
 * @returns {Function} - The wrapped function that catches errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
