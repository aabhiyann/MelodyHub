import mongoose, { Document } from "mongoose";

export interface ISong extends Document {
	title: string;
	artist: string;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	albumId?: mongoose.Types.ObjectId;
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
			type: Number,
			required: true,
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
	},
	{ timestamps: true }
);

// Indexes for query optimization
songSchema.index({ createdAt: -1 }); // For trending/recent song queries
songSchema.index({ albumId: 1 }); // For album-specific song queries
songSchema.index({ title: 'text', artist: 'text' }); // For text search (future feature)

export const Song = mongoose.model<ISong>("Song", songSchema);
