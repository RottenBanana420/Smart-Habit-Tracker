require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  },
  db: {
    path: process.env.DB_PATH || "./database.sqlite",
  },
};

// Validate required configuration
const requiredConfig = ["jwt.secret"];
for (const configPath of requiredConfig) {
  const parts = configPath.split(".");
  let current = config;
  let valid = true;

  for (const part of parts) {
    if (current[part] === undefined) {
      valid = false;
      break;
    }
    current = current[part];
  }

  if (!valid || current === undefined) {
    console.warn(`Missing required config: ${configPath}`);
  }
}

module.exports = config;
