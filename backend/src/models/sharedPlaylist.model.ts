import mongoose, { Document, Schema } from "mongoose";

export interface ISharedPlaylist extends Document {
    name: string;
    description?: string;
    owner: string; // Clerk user ID
    collaborators: string[]; // Clerk user IDs with edit access
    viewers: string[]; // Clerk user IDs with view access
    songs: mongoose.Types.ObjectId[]; // Song references
    isPublic: boolean;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sharedPlaylistSchema = new Schema<ISharedPlaylist>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        owner: {
            type: String,
            required: true,
            index: true,
        },
        collaborators: [{
            type: String,
        }],
        viewers: [{
            type: String,
        }],
        songs: [{
            type: Schema.Types.ObjectId,
            ref: 'Song',
        }],
        isPublic: {
            type: Boolean,
            default: false,
        },
        imageUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
sharedPlaylistSchema.index({ owner: 1, createdAt: -1 });
sharedPlaylistSchema.index({ collaborators: 1 });
sharedPlaylistSchema.index({ isPublic: 1, createdAt: -1 });

export const SharedPlaylist = mongoose.model<ISharedPlaylist>("SharedPlaylist", sharedPlaylistSchema);
