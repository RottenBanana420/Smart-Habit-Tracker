import env from "./env";

/**
 * Application configuration
 * Centralizes all configuration settings for the application
 */
export const config = {
  // Environment variables
  env,

  // API configuration
  api: {
    baseUrl: env.apiUrl,
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
  },

  // Feature flags
  features: {
    enableCharts: true,
    enableNotifications: env.isDevelopment, // Only enable in development for now
    enableOfflineMode: false, // Future feature
  },

  // UI configuration
  ui: {
    theme: "light", // Default theme
    animationsEnabled: true,
    dateFormat: "MMM dd, yyyy",
    timeFormat: "h:mm a",
  },
};

export default config;
