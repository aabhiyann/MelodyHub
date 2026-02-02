# Free Music Streaming Options

This project currently streams **self-hosted** audio files (e.g., `public/songs/*.mp3`).
If you want more content without licensing issues, consider the options below.

## Preview APIs (30-second clips)

- **Spotify Web API**
  - Provides `preview_url` (30s) for many tracks.
  - Requires app registration and API credentials.
  - Best for preview-only experiences.

- **Deezer API**
  - Provides 30-second preview URLs.
  - Free to use with rate limits.

## Full-length, royalty-free catalogs

- **Jamendo API**
  - Free music catalog for streaming.
  - Suitable for full-track playback.

- **Free Music Archive (FMA)**
  - Large catalog of free/CC-licensed tracks.
  - Often used via datasets or API wrappers.

- **Pixabay Music**
  - Royalty-free tracks, often downloadable.
  - You can self-host or link directly.

## Recommendations

- **Short term**: Keep self-hosted tracks and fix `audioUrl` resolution.
- **Medium term**: Add Spotify/Deezer previews for a larger catalog.
- **Long term**: Integrate Jamendo or other royalty-free catalogs for full-length streaming.
