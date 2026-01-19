# Feature Spec: AI Playlist Generator

**Feature**: AI-Powered Playlist Generation  
**Status**: Planning  
**Owner**: Backend Team  

## 1. Overview
Allow users to generate playlists based on natural language prompts (e.g., "Upbeat workout music for a sunny morning"). We will use an LLM (Large Language Model) to interpret the prompt and match it with songs in our database.

## 2. Technical Architecture

### 2.1 AI Provider Choice
We will use **Google Gemini 1.5 Flash** (via Google Generative AI SDK).
*   **Why?**: It has a generous free tier, low latency, and good JSON structured output capabilities.
*   **Alternative**: OpenAI GPT-4o (Costly), DeepSeek (High latency).

### 2.2 Data Flow
1.  **Frontend**: User enters text prompt in `AIPlaylistDialog`.
2.  **Backend**: `POST /api/ai/generate-playlist`
3.  **Service**:
    *   Fetch all song metadata (Title, Artist, Genre/Mood if available) from DB.
    *   Construct a prompt context: "Here is a list of songs: [...]. The user wants: '{userPrompt}'. Return a JSON list of song IDs that match."
    *   Call Gemini API.
4.  **Database**: Create a new `Playlist` with the returned song IDs.
5.  **Response**: Return the new playlist object.

## 3. API Contract

**Endpoint**: `POST /api/ai/generate-playlist`

**Request**:
```json
{
  "prompt": "Sad songs for a rainy day",
  "userId": "user_123"
}
```

**Response**:
```json
{
  "playlistId": "playlist_999",
  "name": "Sad songs for a rainy day",
  "songs": [...]
}
```

## 4. Implementation Steps
1.  **Backend**: Install `@google/generative-ai`.
2.  **Backend**: Create `AIService`.
3.  **Backend**: Create `AIController`.
4.  **Frontend**: Create `AIPlaylistDialog` component.
