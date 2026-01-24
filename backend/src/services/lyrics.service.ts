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

    // Placeholder for external API integration
    private async fetchLyricsFromExternal(title: string, artist: string): Promise<string | null> {
        console.log(`[LyricsService] Fetching lyrics for: ${title} - ${artist}`);

        // Mock Lyrics (LRC Format for synced display)
        // Real implementation would use axios to call an API
        return `[00:05.00] ♫ (Instrumental Intro) ♫
[00:10.00] This is a generated lyric placeholder
[00:15.00] For the song "${title}"
[00:20.00] By the artist "${artist}"
[00:25.00] Implementing real lyrics requires an API key
[00:30.00] But this demonstrates the sync capability
[00:35.00] ♫ (Instrumental Break) ♫
[00:40.00] Enjoy the music on MelodyHub!`;
    }
}

export const lyricsService = new LyricsService();
