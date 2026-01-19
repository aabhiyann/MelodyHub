# API Documentation 📡

Base URL: `/api`

## Authentication

### `POST /auth/callback`
Handle Clerk authentication callback and sync user data.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user data.

## Songs

### `GET /songs`
Retrieve all songs.
- **Response**: `200 OK` `[ { "title": "Song", "artist": "Artist", ... } ]`

### `GET /songs/featured`
Retrieve featured songs for the home page.
- **Response**: `200 OK` `[ ... ]`

### `GET /songs/made-for-you`
Retrieve personalized recommendations.
- **Response**: `200 OK` `[ ... ]`

### `GET /songs/trending`
Retrieve trending songs based on plays.
- **Response**: `200 OK` `[ ... ]`

## Albums

### `GET /albums`
Retrieve all albums.
- **Response**: `200 OK` `[ { "title": "Album", "songs": [...] } ]`

### `GET /albums/:id`
Retrieve a specific album by ID.
- **Params**: `id` (string)
- **Response**: `200 OK` `{ "title": "Album", "songs": [...] }`

## Users

### `GET /users`
Retrieve all users (Admin only).
- **Response**: `200 OK` `[ ... ]`

### `GET /users/messages/:userId`
Get chat history with a specific user.
- **Params**: `userId` (Clerk ID)
- **Response**: `200 OK` `[ { "content": "Hello", "senderId": "...", ... } ]`

## Analytics (Admin)

### `GET /stats`
Get dashboard statistics.
- **Response**: `200 OK`
  ```json
  {
    "totalUsers": 150,
    "totalSongs": 340,
    "totalAlbums": 45,
    "totalArtists": 20
  }
  ```

## AI

### `POST /ai/generate`
Generate a playlist using Google Gemini.
- **Body**: `{ "prompt": "Sad songs for rainy day" }`
- **Response**: `200 OK`
  ```json
  {
    "songs": [ ... ] // Array of song objects
  }
  ```

## Error Codes

-   `400 Bad Request`: Invalid input.
-   `401 Unauthorized`: Missing or invalid authentication.
-   `403 Forbidden`: Admin privileges required.
-   `404 Not Found`: Resource does not exist.
-   `500 Internal Server Error`: Server-side issue.
