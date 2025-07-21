require("dotenv").config();

const env = process.env.NODE_ENV || "development";

// Base configuration
const baseConfig = {
  env,
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  },
  db: {
    path: process.env.DB_PATH || "./database.sqlite",
  },
};

// Environment-specific configurations
const envConfigs = {
  development: {
    ...baseConfig,
    db: {
      ...baseConfig.db,
      path: process.env.DB_PATH || "./database-dev.sqlite",
    },
    logging: {
      level: "debug",
      enabled: true,
    },
  },
  test: {
    ...baseConfig,
    port: process.env.TEST_PORT || 3001,
    db: {
      ...baseConfig.db,
      path: process.env.TEST_DB_PATH || ":memory:",
    },
    logging: {
      level: "error",
      enabled: false,
    },
  },
  production: {
    ...baseConfig,
    db: {
      ...baseConfig.db,
      path: process.env.DB_PATH || "./database-prod.sqlite",
    },
    logging: {
      level: "info",
      enabled: true,
    },
  },
};

const config = envConfigs[env] || envConfigs.development;

// Validate required configuration
const requiredConfig = ["jwt.secret", "db.path"];

function validateConfig(config, requiredPaths) {
  const errors = [];

  for (const configPath of requiredPaths) {
    const parts = configPath.split(".");
    let current = config;
    let valid = true;

    for (const part of parts) {
      if (
        current[part] === undefined ||
        current[part] === null ||
        current[part] === ""
      ) {
        valid = false;
        break;
      }
      current = current[part];
    }

    if (!valid) {
      errors.push(`Missing required configuration: ${configPath}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join("\n")}`);
  }
}

// Validate the configuration
validateConfig(config, requiredConfig);

// Additional environment-specific validation
if (config.env === "production") {
  // In production, ensure JWT_SECRET is not the default value
  if (config.jwt.secret === "your_jwt_secret") {
    throw new Error(
      "JWT_SECRET must be changed from default value in production"
    );
  }

  // Ensure port is a valid number
  const port = parseInt(config.port, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be a valid port number between 1 and 65535");
  }

  // Ensure JWT expiration is set
  if (!config.jwt.expiresIn) {
    throw new Error("JWT_EXPIRATION must be set in production");
  }
}

module.exports = config;
