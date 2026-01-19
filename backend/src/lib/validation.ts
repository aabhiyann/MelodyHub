import { z } from 'zod';

// ============================================
// Song Validation Schemas
// ============================================

export const createSongSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    artist: z.string().min(1, 'Artist is required').max(100, 'Artist too long'),
    albumId: z.string().optional(),
    duration: z.number().positive('Duration must be positive'),
    audioUrl: z.string().url('Invalid audio URL'),
    imageUrl: z.string().url('Invalid image URL'),
});

export const updateSongSchema = createSongSchema.partial();

// ============================================
// Album Validation Schemas
// ============================================

export const createAlbumSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    artist: z.string().min(1, 'Artist is required').max(100, 'Artist too long'),
    imageUrl: z.string().url('Invalid image URL'),
    releaseYear: z.number().int().min(1900).max(new Date().getFullYear()),
});

export const updateAlbumSchema = createAlbumSchema.partial();

// ============================================
// Message Validation Schemas
// ============================================

export const sendMessageSchema = z.object({
    receiverId: z.string().min(1, 'Receiver ID is required'),
    content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
});

// ============================================
// AI Playlist Validation Schemas
// ============================================

export const generatePlaylistSchema = z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500, 'Prompt too long'),
});

// ============================================
// Query Parameter Schemas
// ============================================

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const idParamSchema = z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
});

// ============================================
// User Validation Schemas
// ============================================

export const updateUserSchema = z.object({
    fullName: z.string().min(1).max(100).optional(),
    imageUrl: z.string().url().optional(),
});

// ============================================
// Type Exports (for TypeScript)
// ============================================

export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GeneratePlaylistInput = z.infer<typeof generatePlaylistSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
