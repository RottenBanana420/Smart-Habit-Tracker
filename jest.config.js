/**
 * Jest configuration file
 */
module.exports = {
  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/tests/**/*.test.js"],

  // An array of regexp pattern strings that are matched against all test paths
  // matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["text", "lcov", "clover"],

  // The root directory that Jest should scan for tests and modules within
  rootDir: ".",

  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>"],

  // Setup files that will be run before each test
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // The maximum amount of workers used to run your tests
  maxWorkers: "50%",

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Force Jest to exit after all tests complete
  // This can help with lingering handles, but it's better to fix the root cause
  forceExit: false,

  // Set a timeout for the test runner
  testTimeout: 30000,
};
