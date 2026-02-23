import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Song } from "../models/song.model.js";

export class AIController {
	private genAI: GoogleGenerativeAI;

	constructor() {
		// Ensure API key is present
		if (!process.env.GEMINI_API_KEY) {
			console.error("GEMINI_API_KEY is missing in environment variables");
		}
		this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
	}

	generatePlaylist = async (req: Request, res: Response): Promise<void> => {
		try {
			const { prompt, userContext } = req.body;

			if (!prompt) {
				res.status(400).json({ message: "Prompt is required" });
				return;
			}

			const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

			const systemPrompt = `
				You are a professional music curator and DJ.
				Create a playlist of 15-20 songs based on this user prompt: "${prompt}".
				${userContext ? `User context: ${JSON.stringify(userContext)}` : ""}

				Return ONLY a valid JSON object with this exact structure:
				{
					"name": "Creative Playlist Title",
					"description": "A short, engaging description of the vibe (max 2 sentences)",
					"songs": [
						{
							"title": "Song Title",
							"artist": "Artist Name",
							"reasoning": "Why this fits the vibe (max 10 words)"
						}
					]
				}

				Ensure the songs are real and popular enough to be found in a standard music database.
				Do not include any markdown formatting (like \`\`\`json), just the raw JSON string.
			`;

			// Retry with exponential backoff for rate limits
			let text = "";
			const maxRetries = 3;
			for (let attempt = 0; attempt < maxRetries; attempt++) {
				try {
					const result = await model.generateContent(systemPrompt);
					const response = await result.response;
					text = response.text();
					break; // Success, exit retry loop
				} catch (retryError: any) {
					const isRateLimit = retryError?.message?.includes("429") ||
						retryError?.message?.includes("quota") ||
						retryError?.message?.includes("Too Many Requests");

					if (isRateLimit && attempt < maxRetries - 1) {
						const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
						console.log(`Gemini rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
						await new Promise(resolve => setTimeout(resolve, delay));
						continue;
					}
					throw retryError; // Not rate limit or exhausted retries
				}
			}

			// Clean up any markdown code blocks if Gemini mimics them
			text = text.replace(/```json/g, "").replace(/```/g, "").trim();

			let playlistData;
			try {
				playlistData = JSON.parse(text);
			} catch (parseError) {
				console.error("Failed to parse Gemini response:", text);
				res.status(500).json({ message: "Failed to generate valid playlist format" });
				return;
			}

			// Match generated songs with database records
			const songPromises = playlistData.songs.map(async (generatedSong: any) => {
				try {
					// Flexible matching for title and artist
					const song = await Song.findOne({
						$text: { $search: generatedSong.title }
					});

					// If text search fails, try regex for partial title match
					if (!song) {
						return await Song.findOne({
							title: { $regex: new RegExp(generatedSong.title, "i") }
						});
					}

					return song;
				} catch (err) {
					console.warn(`Could not find song: ${generatedSong.title}`);
					return null;
				}
			});

			const foundSongs = (await Promise.all(songPromises)).filter(s => s !== null);

			// If we found too few songs, we might want to fill with recommendations or just return what we have.
			// Ideally, we'd have a fallback, but for now returned the found ones.

			// Map found songs to the structure expected by frontend if needed, 
			// but since frontend expects Song objects, we just replace the list.

			// However, we want to keep the "reasoning" from AI if possible?
			// The frontend StageResults doesn't seem to display reasoning currently (checked code: displays title, artist).
			// But let's verify StageResults again. It imports Song type.

			playlistData.songs = foundSongs;

			res.status(200).json(playlistData);

		} catch (error: any) {
			console.error("Error generating playlist:", error);
			const errorMsg = error?.message || "";

			// Handle rate limiting
			if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Too Many Requests")) {
				res.status(429).json({
					message: "AI generation rate limit reached. Please try again in a minute.",
					retryAfter: 60
				});
				return;
			}

			// Handle missing/invalid API key
			if (errorMsg.includes("API_KEY") || errorMsg.includes("401") || errorMsg.includes("403")) {
				res.status(503).json({
					message: "AI service is temporarily unavailable. Please try again later."
				});
				return;
			}

			res.status(500).json({ message: "Failed to generate playlist. Please try again.", error: errorMsg });
		}
	};
}
