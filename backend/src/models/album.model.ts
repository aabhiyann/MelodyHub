import mongoose, { Document } from "mongoose";

export interface IAlbum extends Document {
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const albumSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
		imageUrl: { type: String, required: true },
		releaseYear: { type: Number, required: true },
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true }
);

export const Album = mongoose.model<IAlbum>("Album", albumSchema);
