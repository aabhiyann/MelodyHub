# Backend Developer Guide 🛠️

## Overview

This guide is for backend engineers working on the **MelodyHub** API. It details the server architecture, database schema, API standards, and security practices.

## Tech Stack

-   **Runtime**: Node.js (v20+)
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB (Mongoose ODM)
-   **Real-time**: Socket.io
-   **Cloud Storage**: Cloudinary
-   **Auth**: Clerk (Middleware integration)
-   **Testing**: Jest

## Architecture Pattern

We follow a **Controller-Service-Model** layered architecture to separate concerns.

1.  **Routes** (`/routes`): Define endpoints and apply middleware.
2.  **Controllers** (`/controllers`): Handle HTTP request/response parsing and validation.
3.  **Services** (`/services`): Contain business logic and database interactions.
4.  **Models** (`/models`): Define Mongoose schemas and data structure.

### Request Flow
`Client Request` -> `Route` -> `Middleware (Auth)` -> `Controller` -> `Service` -> `Database`

## Directory Structure

```
backend/src/
├── controllers/    # Request handlers (e.g., auth.controller.ts)
├── models/         # Mongoose schemas (e.g., song.model.ts)
├── routes/         # Express routers (e.g., auth.route.ts)
├── services/       # Business logic (e.g., auth.service.ts)
├── middleware/     # Auth checks, error handling
├── lib/            # DB connection, Cloudinary config
└── __tests__/      # Jest tests
```

## Database Schema (MongoDB)

### Key Collections
-   **Users**: Stores Clerk ID, profile info.
-   **Songs**: Metadata (title, artist, audioUrl, imageUrl, duration).
-   **Albums**: Collections of songs.
-   **Messages**: Chat history (senderId, receiverId, content).

*Refer to `04_SYSTEM_DESIGN.md` for the Entity Relationship Diagram (ERD).*

## API Standards

-   **RESTful Design**: Use standard HTTP methods (GET, POST, PUT, DELETE).
-   **Response Format**:
    ```json
    {
      "success": true, // or false
      "data": { ... }, // Payload
      "message": "Operation successful" // Optional status message
    }
    ```
-   **Error Handling**: Use the global error handler middleware. Do not crash the server on errors.

## Authentication & Security

-   **Clerk**: All protected routes must use `protectRoute` or `requireAdmin` middleware.
-   **Environment Variables**: Never commit `.env` files. Use `validateEnv()` on startup.
-   **Input Validation**: Validate inputs in the Controller layer before passing to Service.

## Real-Time Features (Socket.io)

-   **Events**:
    -   `user_connected`: Broadcasts user online status.
    -   `send_message`: Handles chat messages.
    -   `receive_message`: Client listener for new messages.
    -   `activity_updated`: User activity (e.g., "Listening to...") updates.

## Testing Strategy

-   **Unit/Integration Tests**: Use Jest.
-   **Mocking**: Mock external services (Cloudinary, Clerk) during tests to ensure isolation.
-   **Command**: `npm test` runs the test suite.

## Deployment

-   **Build**: `npm run build` compiles TypeScript to JavaScript in `dist/`.
-   **Start**: `npm start` runs the compiled code from `dist/index.js`.
-   **Production**: Ensure `NODE_ENV=production` is set.
