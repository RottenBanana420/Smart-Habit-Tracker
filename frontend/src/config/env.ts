/**
 * Type-safe environment variable configuration
 * This file provides a centralized way to access environment variables with proper typing
 */

interface EnvConfig {
  apiUrl: string;
  appName: string;
  isDebug: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  isDevelopment: boolean;
  isProduction: boolean;
}

const env: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "/api",
  appName: import.meta.env.VITE_APP_NAME || "Habit Tracker",
  isDebug: import.meta.env.VITE_DEBUG === "true",
  logLevel:
    (import.meta.env.VITE_LOG_LEVEL as EnvConfig["logLevel"]) || "error",
  isDevelopment: import.meta.env.MODE === "development",
  isProduction: import.meta.env.MODE === "production",
};

export default env;
