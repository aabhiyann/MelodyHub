import { Song } from "../models/song.model.js";

export class LyricsService {
    // Fetch lyrics for a song (from DB or External)
    async getLyrics(songId: string): Promise<string | null> {
        const song = await Song.findById(songId);
        if (!song) {
            throw new Error("Song not found");
        }

        // If lyrics exist in DB, return them
        if (song.lyrics) {
            return song.lyrics;
        }

        // Otherwise, attempt to fetch from external source
        // In a real app, integrate Genius/Musixmatch API here
        const fetchedLyrics = await this.fetchLyricsFromExternal(song.title, song.artist);

        // If found, save to DB
        if (fetchedLyrics) {
            song.lyrics = fetchedLyrics;
            await song.save();
        }

        return fetchedLyrics;
    }

    // Fetch lyrics from a free public source (LRCLIB)
    private async fetchLyricsFromExternal(title: string, artist: string): Promise<string | null> {
        console.log(`[LyricsService] Fetching lyrics for: ${title} - ${artist}`);

        const url = new URL("https://lrclib.net/api/get");
        url.searchParams.set("track_name", title);
        url.searchParams.set("artist_name", artist);

        try {
            const response = await fetch(url.toString(), {
                headers: {
                    "User-Agent": "MelodyHub/1.0 (lyrics fetch)",
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            const lyrics = data?.syncedLyrics || data?.plainLyrics || null;
            return typeof lyrics === "string" && lyrics.trim().length > 0 ? lyrics : null;
        } catch (error) {
            console.error("[LyricsService] Failed to fetch lyrics", error);
            return null;
        }
    }
}

export const lyricsService = new LyricsService();
