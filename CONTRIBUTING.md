# Contributing to Habit Tracker

Thank you for considering contributing to the Habit Tracker application! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others when contributing.

## How Can I Contribute?

### Reporting Bugs

If you find a bug in the application, please create an issue in the GitHub repository with the following information:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (OS, Node.js version, etc.)

### Suggesting Enhancements

If you have an idea for an enhancement, please create an issue with the following information:

- A clear, descriptive title
- A detailed description of the enhancement
- Any relevant examples or mockups
- Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests to ensure everything works: `npm test`
5. Commit your changes with a descriptive commit message
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a pull request to the `main` branch of the original repository

## Development Setup

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

4. Initialize the database:

   ```bash
   npm run db:init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### JavaScript Style Guide

- Use ES6+ features where appropriate
- Follow the ESLint configuration provided in the project
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_CASE for constants

### Documentation

- Document all functions, classes, and modules using JSDoc comments
- Keep comments up-to-date with code changes
- Write clear, concise comments that explain "why" rather than "what"

### Testing

- Write tests for all new features and bug fixes
- Maintain or improve test coverage
- Organize tests according to the existing structure

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation if necessary
3. Add or update tests as needed
4. Ensure all tests pass
5. Get approval from at least one reviewer
6. The pull request will be merged once it meets all requirements

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

Reviewers will check for:

- Code quality and style
- Test coverage
- Documentation
- Potential bugs or issues
- Alignment with project goals

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.
