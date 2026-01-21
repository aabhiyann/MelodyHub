import axios from 'axios';

/**
 * iTunes API Integration Service
 * Free music metadata - no API key required
 */

interface iTunesTrack {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    artworkUrl60: string;
    previewUrl: string;
    trackTimeMillis: number;
    primaryGenreName: string;
    releaseDate: string;
    country: string;
}

interface iTunesSearchResponse {
    resultCount: number;
    results: iTunesTrack[];
}

class iTunesService {
    private baseUrl = 'https://itunes.apple.com';

    /**
     * Search for tracks
     */
    async searchTracks(query: string, limit: number = 50): Promise<iTunesTrack[]> {
        try {
            const response = await axios.get<iTunesSearchResponse>(`${this.baseUrl}/search`, {
                params: {
                    term: query,
                    media: 'music',
                    entity: 'song',
                    limit,
                },
            });

            return response.data.results || [];
        } catch (error) {
            console.error('iTunes search error:', error);
            return [];
        }
    }

    /**
     * Get top tracks by genre
     */
    async getTopTracksByGenre(genre: string, limit: number = 50): Promise<iTunesTrack[]> {
        const genreQueries: Record<string, string> = {
            'Rock': 'rock top songs',
            'Pop': 'pop hits',
            'Hip-Hop': 'hip hop rap',
            'Electronic': 'electronic edm',
            'Jazz': 'jazz classics',
            'Classical': 'classical music',
            'R&B': 'r&b soul',
            'Country': 'country music',
            'Indie': 'indie alternative',
            'Metal': 'metal heavy',
            'Folk': 'folk acoustic',
            'Reggae': 'reggae',
            'Blues': 'blues',
            'Latin': 'latin music',
            'K-Pop': 'kpop korean',
        };

        const query = genreQueries[genre] || `${genre} music`;
        return this.searchTracks(query, limit);
    }

    /**
     * Get diverse mix of tracks across genres
     */
    async getDiverseTracks(tracksPerGenre: number = 70): Promise<iTunesTrack[]> {
        const genres = [
            'Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Jazz',
            'Classical', 'R&B', 'Country', 'Indie', 'Metal',
            'Folk', 'Reggae', 'Blues', 'Latin', 'K-Pop'
        ];

        const allTracks: iTunesTrack[] = [];

        for (const genre of genres) {
            console.log(`Fetching ${tracksPerGenre} tracks for ${genre}...`);
            const tracks = await this.getTopTracksByGenre(genre, tracksPerGenre);
            allTracks.push(...tracks);

            // Rate limiting - be nice to iTunes API
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return allTracks;
    }

    /**
     * Generate realistic audio features based on genre
     */
    generateAudioFeatures(genre: string): {
        tempo: number;
        energy: number;
        danceability: number;
        valence: number;
        acousticness: number;
        instrumentalness: number;
        key: number;
        loudness: number;
        mode: number;
    } {
        // Genre-based defaults with randomization
        const genreProfiles: Record<string, any> = {
            'Rock': { tempo: 130, energy: 0.8, danceability: 0.5, valence: 0.6, acousticness: 0.2, instrumentalness: 0.1 },
            'Pop': { tempo: 120, energy: 0.7, danceability: 0.7, valence: 0.7, acousticness: 0.1, instrumentalness: 0.0 },
            'Hip-Hop': { tempo: 95, energy: 0.7, danceability: 0.8, valence: 0.5, acousticness: 0.1, instrumentalness: 0.0 },
            'Electronic': { tempo: 128, energy: 0.9, danceability: 0.9, valence: 0.6, acousticness: 0.0, instrumentalness: 0.3 },
            'Jazz': { tempo: 110, energy: 0.4, danceability: 0.4, valence: 0.5, acousticness: 0.6, instrumentalness: 0.5 },
            'Classical': { tempo: 100, energy: 0.3, danceability: 0.2, valence: 0.4, acousticness: 0.9, instrumentalness: 0.9 },
            'R&B': { tempo: 90, energy: 0.6, danceability: 0.7, valence: 0.6, acousticness: 0.3, instrumentalness: 0.0 },
            'Country': { tempo: 115, energy: 0.6, danceability: 0.5, valence: 0.6, acousticness: 0.5, instrumentalness: 0.1 },
            'Indie': { tempo: 120, energy: 0.6, danceability: 0.5, valence: 0.5, acousticness: 0.4, instrumentalness: 0.2 },
            'Metal': { tempo: 150, energy: 0.95, danceability: 0.4, valence: 0.4, acousticness: 0.0, instrumentalness: 0.3 },
        };

        const profile = genreProfiles[genre] || genreProfiles['Pop'];

        // Add randomization (±15%) for variety
        const randomize = (value: number, range: number = 0.15) => {
            const min = Math.max(0, value - range);
            const max = Math.min(1, value + range);
            return Math.random() * (max - min) + min;
        };

        return {
            tempo: Math.round(profile.tempo + (Math.random() - 0.5) * 30),
            energy: randomize(profile.energy),
            danceability: randomize(profile.danceability),
            valence: randomize(profile.valence),
            acousticness: randomize(profile.acousticness),
            instrumentalness: randomize(profile.instrumentalness),
            key: Math.floor(Math.random() * 12), // 0-11 (C, C#, D, etc.)
            loudness: -10 + Math.random() * 5, // -10 to -5 dB
            mode: Math.random() > 0.5 ? 1 : 0, // Major or Minor
        };
    }
}

// Export singleton
export const itunesService = new iTunesService();
