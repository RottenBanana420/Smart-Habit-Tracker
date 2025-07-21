/**
 * Tests for async handler utility
 */
const { asyncHandler } = require("../../../src/utils/asyncHandler");

describe("Async Handler Utility", () => {
  let req, res, next;

  beforeEach(() => {
    // Mock request, response, and next function
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call the handler function with req, res, and next", async () => {
    const handler = jest.fn().mockResolvedValue();
    const middleware = asyncHandler(handler);

    await middleware(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
  });

  it("should call next with error when handler throws an error", async () => {
    const error = new Error("Test error");
    const handler = jest.fn().mockRejectedValue(error);
    const middleware = asyncHandler(handler);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should not call next when handler resolves successfully", async () => {
    const handler = jest.fn().mockResolvedValue({ success: true });
    const middleware = asyncHandler(handler);

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should handle synchronous errors in the handler", async () => {
    const error = new Error("Sync error");
    const handler = jest.fn().mockImplementation(() => {
      throw error;
    });
    const middleware = asyncHandler(handler);

    try {
      await middleware(req, res, next);
    } catch (e) {
      // Expected to throw, we catch it here
    }

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should work with async functions that return values", async () => {
    const responseData = { data: "test" };
    const handler = jest.fn().mockImplementation(async (req, res) => {
      res.json(responseData);
      return responseData;
    });
    const middleware = asyncHandler(handler);

    await middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(responseData);
    expect(next).not.toHaveBeenCalled();
  });

  it("should work with async functions that call next directly", async () => {
    const handler = jest.fn().mockImplementation(async (req, res, next) => {
      next();
    });
    const middleware = asyncHandler(handler);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
