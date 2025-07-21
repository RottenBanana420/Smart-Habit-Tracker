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
│   ├── api/                  # API tests
│   ├── integration/          # Integration tests
│   ├── unit/                 # Unit tests
│   └── utils/                # Test utilities
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file to configure your environment variables.

5. Initialize the database:

   ```bash
   npm run db:init
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start the development server with hot-reloading
- `npm start` - Start the production server
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:api` - Run API tests
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run db:init` - Initialize the database with schema

## Environment Configuration

The application uses environment variables for configuration. These are loaded from a `.env` file in the project root.

### Required Environment Variables

- `NODE_ENV`: The environment mode (`development`, `test`, or `production`)
- `PORT`: The port number for the server
- `JWT_SECRET`: Secret key for JWT token generation and validation
- `DB_PATH`: Path to the SQLite database file

### Optional Environment Variables

- `JWT_EXPIRATION`: JWT token expiration time in seconds (default: 86400 = 24 hours)
- `LOG_LEVEL`: Log level (error, warn, info, http, verbose, debug, silly)
- `LOG_ENABLED`: Enable or disable logging (true/false)
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS
- `CORS_ALLOW_CREDENTIALS`: Set to true to allow credentials (cookies, authorization headers, etc.)
- `RATE_LIMIT_MAX`: Maximum number of requests per window for rate limiting
- `RATE_LIMIT_WINDOW`: Time window in milliseconds for rate limiting
- `TEST_PORT`: Port number for the test server
- `TEST_DB_PATH`: Database path for tests (use :memory: for in-memory SQLite database)

### Environment-Specific Configuration

The application supports different configurations for development, test, and production environments. These are defined in `src/config/index.js`.

## API Documentation

### Authentication Endpoints

#### Register a new user

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["user"]
      },
      "token": "jwt-token-here"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**: `{ "status": "fail", "message": "Username, email, and password are required" }`

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["user"]
      },
      "token": "jwt-token-here"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "status": "fail", "message": "Invalid email or password" }`

#### Get Current User

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth required**: Yes (JWT token in Authorization header)
- **Headers**: `Authorization: Bearer your-token-here`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "User info retrieved successfully",
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["user"]
      }
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "status": "fail", "message": "Authentication token is required" }`

#### Refresh Token

- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Auth required**: Yes (JWT token in Authorization header)
- **Headers**: `Authorization: Bearer your-token-here`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Token refreshed successfully",
      "token": "new-jwt-token-here"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "status": "fail", "message": "Authentication token is required" }`

### Other Endpoints

#### Health Check

- **URL**: `/api/health`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "status": "ok",
      "timestamp": "2023-07-21T12:00:00.000Z",
      "environment": "development",
      "database": {
        "path": "./database.sqlite"
      }
    }
    ```

#### Protected Example

- **URL**: `/api/protected`
- **Method**: `GET`
- **Auth required**: Yes (JWT token in Authorization header)
- **Headers**: `Authorization: Bearer your-token-here`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "This is a protected route",
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["user"]
      }
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "status": "fail", "message": "Authentication token is required" }`

#### Admin Example

- **URL**: `/api/admin`
- **Method**: `GET`
- **Auth required**: Yes (JWT token with admin role)
- **Headers**: `Authorization: Bearer your-token-here`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "This is an admin-only route",
      "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["admin"]
      }
    }
    ```
- **Error Response**:
  - **Code**: 403 Forbidden
  - **Content**: `{ "status": "fail", "message": "Insufficient permissions" }`

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Register or login to get a JWT token
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer your-token-here
   ```

Tokens expire after the time specified in the `JWT_EXPIRATION` environment variable (default: 24 hours).

## Error Handling

The application uses a centralized error handling system. All errors are processed through the error handling middleware, which returns appropriate HTTP status codes and error messages.

Custom error classes are available in `src/utils/errors.js` for different types of errors:

- `AppError`: Base error class
- `NotFoundError`: 404 Not Found
- `BadRequestError`: 400 Bad Request
- `UnauthorizedError`: 401 Unauthorized
- `ForbiddenError`: 403 Forbidden
- `ValidationError`: 422 Unprocessable Entity
- `DatabaseError`: 500 Internal Server Error

## Testing

The application uses Jest for testing. Tests are organized into three categories:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test the interaction between components
- **API Tests**: Test the API endpoints

To run tests:

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run API tests
npm run test:api
```

## Contributing

We welcome contributions to the Habit Tracker Application! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests to ensure everything works: `npm test`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Coding Standards

- Follow the ESLint configuration
- Write tests for new features
- Update documentation as needed
- Follow the existing code style and patterns

### Pull Request Process

1. Ensure all tests pass
2. Update the README.md with details of changes if applicable
3. The pull request will be merged once it has been reviewed and approved

## License

This project is licensed under the MIT License - see the LICENSE file for details.
