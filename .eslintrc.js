module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["standard"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    // Custom rules can be added here
    "no-console": "off", // Allow console.log for server logging
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
  },
  ignorePatterns: ["node_modules/", "coverage/", "*.min.js"],
};
