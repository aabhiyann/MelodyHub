import SpotifyWebApi from 'spotify-web-api-node';

/**
 * Spotify Integration Service
 * Fetch real music data and audio features from Spotify
 */

class SpotifyService {
    private spotifyApi: SpotifyWebApi;
    private tokenExpiresAt: number = 0;

    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        });
    }

    /**
     * Authenticate with Spotify using Client Credentials flow
     */
    async authenticate(): Promise<void> {
        try {
            const data = await this.spotifyApi.clientCredentialsGrant();

            this.spotifyApi.setAccessToken(data.body['access_token']);
            this.tokenExpiresAt = Date.now() + (data.body['expires_in'] * 1000);

            console.log('✅ Spotify API authenticated');
        } catch (error) {
            console.error('Failed to authenticate with Spotify:', error);
            throw error;
        }
    }

    /**
     * Ensure access token is valid
     */
    private async ensureAuthenticated(): Promise<void> {
        if (Date.now() >= this.tokenExpiresAt - 60000) { // Refresh 1 minute before expiry
            await this.authenticate();
        }
    }

    /**
     * Search for tracks by query
     */
    async searchTracks(query: string, limit: number = 20): Promise<any[]> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.searchTracks(query, { limit });
            return data.body.tracks?.items || [];
        } catch (error) {
            console.error('Error searching tracks:', error);
            return [];
        }
    }

    /**
     * Get audio features for a track
     */
    async getAudioFeatures(trackId: string): Promise<any | null> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.getAudioFeaturesForTrack(trackId);
            return data.body;
        } catch (error) {
            console.error(`Error getting audio features for ${trackId}:`, error);
            return null;
        }
    }

    /**
     * Get audio features for multiple tracks (batch)
     */
    async getAudioFeaturesMultiple(trackIds: string[]): Promise<any[]> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.getAudioFeaturesForTracks(trackIds);
            return data.body.audio_features || [];
        } catch (error) {
            console.error('Error getting audio features (batch):', error);
            return [];
        }
    }

    /**
     * Get track details
     */
    async getTrack(trackId: string): Promise<any | null> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.getTrack(trackId);
            return data.body;
        } catch (error) {
            console.error(`Error getting track ${trackId}:`, error);
            return null;
        }
    }

    /**
     * Get playlist tracks
     */
    async getPlaylistTracks(playlistId: string, limit: number = 100): Promise<any[]> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.getPlaylistTracks(playlistId, { limit });
            return data.body.items || [];
        } catch (error) {
            console.error(`Error getting playlist ${playlistId}:`, error);
            return [];
        }
    }

    /**
     * Get top tracks for a genre (via playlist)
     */
    async getTopTracksByGenre(genre: string, limit: number = 50): Promise<any[]> {
        await this.ensureAuthenticated();

        try {
            // Search for genre playlists
            const playlists = await this.spotifyApi.searchPlaylists(`Top ${genre}`, { limit: 1 });

            if (playlists.body.playlists?.items && playlists.body.playlists.items.length > 0) {
                const playlistId = playlists.body.playlists.items[0].id;
                return await this.getPlaylistTracks(playlistId, limit);
            }

            return [];
        } catch (error) {
            console.error(`Error getting top tracks for genre ${genre}:`, error);
            return [];
        }
    }

    /**
     * Get recommendations based on seed tracks/artists
     */
    async getRecommendations(options: {
        seedTracks?: string[];
        seedArtists?: string[];
        seedGenres?: string[];
        limit?: number;
    }): Promise<any[]> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.getRecommendations({
                seed_tracks: options.seedTracks,
                seed_artists: options.seedArtists,
                seed_genres: options.seedGenres,
                limit: options.limit || 20,
            });

            return data.body.tracks || [];
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return [];
        }
    }

    /**
     * Get available genre seeds
     */
    async getGenreSeeds(): Promise<string[]> {
        await this.ensureAuthenticated();

        try {
            const data = await this.spotifyApi.getAvailableGenreSeeds();
            return data.body.genres || [];
        } catch (error) {
            console.error('Error getting genre seeds:', error);
            return [];
        }
    }
}

// Export singleton
export const spotifyService = new SpotifyService();
