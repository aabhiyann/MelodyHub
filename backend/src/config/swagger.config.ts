import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MelodyHub API',
            version: '1.0.0',
            description: `
# MelodyHub API Documentation

MelodyHub is an AI-powered music streaming platform with intelligent recommendations.

## Features
- 🎵 Music discovery (featured, trending, new releases)
- 🤖 AI-powered personalized recommendations
- 📊 User behavior tracking and analytics
- 💾 Redis-powered caching for sub-100ms responses
- 🔒 Clerk authentication

## Authentication
Most endpoints require authentication via Clerk. Include the session token in your requests.

## Rate Limiting
- **Development**: No limits
- **Production**: 100 requests per 15 minutes per IP

## Caching Strategy
- Featured songs: 1 hour TTL
- Trending songs: 15 minutes TTL
- Recommendations: 6 hours TTL (user-specific)
- New releases: 30 minutes TTL

## Response Format
All responses follow this structure:
\`\`\`json
{
  "success": true | false,
  "data": { ... },
  "message": "Optional message",
  "error": "Error message if success is false"
}
\`\`\`

## Recommendation Algorithms
- **Collaborative Filtering**: User similarity via Jaccard index
- **Content-Based**: Audio feature matching via Cosine similarity
- **Hybrid**: 60% collaborative + 40% content-based
- **Cold Start**: Popular songs for new users
            `,
            contact: {
                name: 'MelodyHub Support',
                email: 'support@melodyhub.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5001/api',
                description: 'Development server',
            },
            {
                url: 'https://api.melodyhub.com/api',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                ClerkAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Clerk session token',
                },
            },
            schemas: {
                Song: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        title: { type: 'string', example: 'Bohemian Rhapsody' },
                        artist: { type: 'string', example: 'Queen' },
                        imageUrl: { type: 'string', example: 'https://cloudinary.com/...' },
                        audioUrl: { type: 'string', example: 'https://cloudinary.com/...' },
                        duration: { type: 'number', example: 354 },
                        genre: { type: 'string', example: 'Rock' },
                        playCount: { type: 'number', example: 1000000 },
                        likeCount: { type: 'number', example: 50000 },
                        isFeatured: { type: 'boolean', example: true },
                        isTrending: { type: 'boolean', example: false },
                        features: {
                            type: 'object',
                            properties: {
                                tempo: { type: 'number', example: 120 },
                                energy: { type: 'number', minimum: 0, maximum: 1, example: 0.8 },
                                danceability: { type: 'number', minimum: 0, maximum: 1, example: 0 .6 },
                                valence: { type: 'number', minimum: 0, maximum: 1, example: 0.7 },
                            },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        error: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
