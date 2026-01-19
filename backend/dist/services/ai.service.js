import { GoogleGenerativeAI } from "@google/generative-ai";
import { Song } from "../models/song.model.js";
export class AIService {
    genAI;
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not defined");
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    async generatePlaylist(prompt) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // 1. Fetch metadata for all songs
        const allSongs = await Song.find({}, { _id: 1, title: 1, artist: 1 });
        const songsContext = JSON.stringify(allSongs);
        // 2. Create Prompt
        const systemPrompt = `
      You are an expert DJ. 
      Here is the available music library in JSON format: ${songsContext}.
      
      User request: "${prompt}".
      
      Task: Select the best 5-10 songs from the library that match the user's request.
      Return strictly valid JSON array of song IDs. 
      Example response: ["60d5ec...", "60d5ec..."].
      Do not add markdown formatting or explanations.
    `;
        // 3. Call AI
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        // 4. Parse Response
        try {
            // Clean markdown if Gemini adds it
            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const songIds = JSON.parse(cleanedText);
            // 5. Fetch full song objects
            const playlistSongs = await Song.find({ _id: { $in: songIds } });
            return playlistSongs;
        }
        catch (error) {
            console.error("AI Parse Error:", text);
            throw new Error("Failed to generate playlist from AI response");
        }
    }
}
