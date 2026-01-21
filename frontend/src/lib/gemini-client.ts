/**
 * Gemini API Client
 * Handles communication with Google Gemini for playlist generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
    console.warn('⚠️ VITE_GEMINI_API_KEY not found. AI playlist generation will use mock data.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

interface Track {
    title: string;
    artist: string;
    reason?: string;
}

interface PlaylistResponse {
    name: string;
    description: string;
    tracks: Track[];
}

/**
 * Generate playlist using Gemini AI
 */
export async function generatePlaylist(userPrompt: string): Promise<PlaylistResponse> {
    if (!genAI) {
        throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Sophisticated prompt engineering
    const prompt = `You are an expert music curator for MelodyHub, a premium music streaming service. Your task is to create the perfect playlist based on the user's mood and preferences.

USER REQUEST: "${userPrompt}"

Create a curated playlist that perfectly matches this request. Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:

{
  "name": "Creative playlist name (3-6 words, catchy and relevant)",
  "description": "One engaging sentence explaining the vibe and why these tracks were chosen",
  "tracks": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "reason": "Brief reason why this track fits (optional, 5-10 words)"
    }
  ]
}

GUIDELINES:
- Generate 10-15 diverse tracks
- Mix popular hits with hidden gems
- Ensure variety in tempo and energy
- Include artists from different eras when appropriate
- Make the playlist name creative and memorable
- Each track should genuinely match the requested mood
- Use real, well-known songs that exist
- Add a "reason" for at least 3-5 key tracks to show your curation expertise

Return ONLY the JSON object, nothing else.`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response (handle markdown code blocks if present)
        let jsonText = response.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?/g, '');
        }

        // Parse the JSON
        const playlist: PlaylistResponse = JSON.parse(jsonText);

        // Validate response structure
        if (!playlist.name || !playlist.description || !Array.isArray(playlist.tracks)) {
            throw new Error('Invalid playlist structure from API');
        }

        if (playlist.tracks.length === 0) {
            throw new Error('No tracks generated');
        }

        return playlist;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate playlist. Please try again.');
    }
}
