import mongoose, { Document } from "mongoose";

export interface ISong extends Document {
	// Basic fields
	title: string;
	artist: string;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	lyrics?: string; // Lyrics in text or LRC format
	albumId?: mongoose.Types.ObjectId;

	// Extended metadata for discovery
	genre?: string;
	year?: number;
	explicit?: boolean;

	// Audio features for AI recommendations
	features?: {
		tempo?: number; // BPM
		energy?: number; // 0-1
		danceability?: number; // 0-1
		valence?: number; // 0-1 (happiness)
		acousticness?: number; // 0-1
		instrumentalness?: number; // 0-1
		key?: number; // 0-11 (musical key)
		loudness?: number; // dB
		mode?: number; // 0 (minor) or 1 (major)
	};

	// Analytics
	playCount: number;
	likeCount: number;
	skipCount: number;

	// Flags
	isFeatured: boolean;
	isTrending: boolean;

	// Timestamps
	createdAt: Date;
	updatedAt: Date;
}

const songSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		artist: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		audioUrl: {
			type: String,
			required: true,
		},
		duration: {
			type: String, // Note: Should ideally be Number (seconds), keeping String as per existing
			required: true,
		},
		lyrics: {
			type: String,
			required: false,
			default: null,
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
		// Extended metadata
		genre: {
			type: String,
			default: null,
		},
		year: {
			type: Number,
			default: null,
		},
		explicit: {
			type: Boolean,
			default: false,
		},
		// Audio features for AI
		features: {
			tempo: { type: Number, default: null },
			energy: { type: Number, min: 0, max: 1, default: null },
			danceability: { type: Number, min: 0, max: 1, default: null },
			valence: { type: Number, min: 0, max: 1, default: null },
			acousticness: { type: Number, min: 0, max: 1, default: null },
			instrumentalness: { type: Number, min: 0, max: 1, default: null },
			key: { type: Number, min: 0, max: 11, default: null },
			loudness: { type: Number, default: null },
			mode: { type: Number, enum: [0, 1], default: null },
		},
		// Analytics
		playCount: {
			type: Number,
			default: 0,
		},
		likeCount: {
			type: Number,
			default: 0,
		},
		skipCount: {
			type: Number,
			default: 0,
		},
		// Flags
		isFeatured: {
			type: Boolean,
			default: false,
		},
		isTrending: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Comprehensive indexes for query optimization
songSchema.index({ createdAt: -1 }); // Recent/new releases
songSchema.index({ playCount: -1 }); // Trending by plays
songSchema.index({ likeCount: -1 }); // Popular songs
songSchema.index({ albumId: 1 }); // Album queries
songSchema.index({ genre: 1 }); // Genre filtering
songSchema.index({ artist: 1 }); // Artist filtering
songSchema.index({ isFeatured: 1 }); // Featured songs
songSchema.index({ isTrending: 1 }); // Trending songs
songSchema.index({ title: 'text', artist: 'text' }); // Text search

// Compound indexes for complex queries
songSchema.index({ genre: 1, playCount: -1 }); // Popular by genre
songSchema.index({ createdAt: -1, playCount: -1 }); // Trending new releases

export const Song = mongoose.model<ISong>("Song", songSchema);
