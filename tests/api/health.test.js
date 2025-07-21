/**
 * API tests for health check endpoint
 */
const request = require("supertest");
const app = require("../../src/app");
const { setupTestDb, teardownTestDb } = require("../utils/testDbConfig");

describe("Health Check API", () => {
  // Setup test database before all tests
  beforeAll(async () => {
    await setupTestDb();
  });

  // Teardown test database after all tests
  afterAll(async () => {
    await teardownTestDb();
  });

  it("should return 200 OK with status information", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("environment", "test");
    expect(response.body).toHaveProperty("database");
  });
});
