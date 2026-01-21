import mongoose from "mongoose";
const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    imageUrl: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
}, { timestamps: true });
// Indexes for query optimization
albumSchema.index({ createdAt: -1 }); // For recent albums
albumSchema.index({ artist: 1 }); // For artist-specific queries
albumSchema.index({ title: 'text', artist: 'text' }); // For text search (future feature)
export const Album = mongoose.model("Album", albumSchema);
