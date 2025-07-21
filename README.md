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
3. Copy `.env.example` to `.env` and update the values
4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

API documentation will be available at `/api-docs` when the server is running.

## Testing

Run tests with:

```
npm test
```

## License

MIT
