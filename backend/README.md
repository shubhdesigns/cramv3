# CramTime Backend

This is a demo backend for the CramTime flashcard application. It provides mock data and API endpoints for testing the frontend.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login with email and password
- POST `/api/auth/signup` - Sign up with email and password

### Flashcards
- GET `/api/flashcards` - Get all flashcards
- POST `/api/flashcards` - Create a new flashcard
- PUT `/api/flashcards/:id` - Update a flashcard
- DELETE `/api/flashcards/:id` - Delete a flashcard

## Demo Credentials
For testing purposes, any email and password combination will work with the authentication endpoints.

## Note
This is a demo backend with mock data. In a production environment, you would need to:
1. Use a real database
2. Implement proper password hashing
3. Use environment variables for sensitive data
4. Add proper error handling
5. Implement rate limiting
6. Add input validation 