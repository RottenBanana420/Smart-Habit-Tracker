# Habit Tracker Application

A robust Node.js backend for tracking and managing daily habits. This application helps users create, monitor, and maintain positive habits through a clean and well-structured API.

## Features

- User authentication and authorization
- Create, read, update, and delete habits
- Track habit completion and streaks
- Generate reports and insights on habit performance
- Secure API with JWT authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Testing**: Jest

## Project Structure

```
├── src/                      # Source code directory
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   └── app.js                # Express application setup
├── tests/                    # Test files
├── .env.example              # Example environment variables
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file to configure your environment
5. Start the development server:
   ```
   npm run dev
   ```

### Environment Configuration

The application uses environment variables for configuration. These are loaded from a `.env` file in the project root.

#### Required Environment Variables

- `NODE_ENV`: The environment mode (`development`, `test`, or `production`)
- `PORT`: The port number for the server
- `JWT_SECRET`: Secret key for JWT token generation and validation
- `DB_PATH`: Path to the SQLite database file

#### Optional Environment Variables

- `JWT_EXPIRATION`: JWT token expiration time in seconds (default: 86400 = 24 hours)
- `LOG_LEVEL`: Log level (error, warn, info, http, verbose, debug, silly)
- `LOG_ENABLED`: Enable or disable logging (true/false)
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS
- `CORS_ALLOW_CREDENTIALS`: Set to true to allow credentials (cookies, authorization headers, etc.)
- `RATE_LIMIT_MAX`: Maximum number of requests per window for rate limiting
- `RATE_LIMIT_WINDOW`: Time window in milliseconds for rate limiting

#### Environment-Specific Configuration

The application supports different configurations for development, test, and production environments. These are defined in `src/config/index.js`.

## API Documentation

API documentation will be available at `/api-docs` when the server is running.

## Testing

Run tests with:

```
npm test
```

## License

MIT
