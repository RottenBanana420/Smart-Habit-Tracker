/**
 * Wraps async route handlers to automatically catch errors and pass them to the next middleware
 * This eliminates the need for try/catch blocks in route handlers
 *
 * @param {Function} fn - The async route handler function
 * @returns {Function} - The wrapped function that catches errors
 *
 * @example
 * // Instead of:
 * router.get('/users', async (req, res, next) => {
 *   try {
 *     const users = await User.findAll();
 *     res.json(users);
 *   } catch (err) {
 *     next(err);
 *   }
 * });
 *
 * // You can write:
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.findAll();
 *   res.json(users);
 * }));
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    try {
      const result = fn(req, res, next);
      return Promise.resolve(result).catch((err) => {
        next(err);
      });
    } catch (error) {
      next(error);
      return Promise.resolve(); // Don't reject to avoid unhandled promise rejection
    }
  };
}

module.exports = { asyncHandler };
