import mongoose, { Document } from 'mongoose';

export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPT'
  | 'NEW_FOLLOWER'
  | 'LIKE_SONG'
  | 'PLAYLIST_INVITE'
  | 'NEW_MESSAGE';

export interface INotification extends Document {
  userId: string; // Clerk ID of the recipient
  type: NotificationType;
  title: string;
  body?: string;
  read: boolean;
  metadata?: Record<string, unknown>; // e.g. { senderId, songId, playlistId }
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'FRIEND_REQUEST',
        'FRIEND_ACCEPT',
        'NEW_FOLLOWER',
        'LIKE_SONG',
        'PLAYLIST_INVITE',
        'NEW_MESSAGE',
      ],
    },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    read: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
