/**
 * PlaylistPreview Component
 * Displays generated AI playlist with track list and actions
 */

import { motion } from 'framer-motion';
import { Music, Play, Heart, Edit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Track {
    title: string;
    artist: string;
    reason?: string;
}

interface Playlist {
    name: string;
    description: string;
    tracks: Track[];
}

interface PlaylistPreviewProps {
    playlist: Playlist;
    onSave?: () => void;
    onEdit?: () => void;
    onRegenerate?: () => void;
}

export const PlaylistPreview = ({
    playlist,
    onSave,
    onEdit,
    onRegenerate,
}: PlaylistPreviewProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
        >
            {/* Playlist Header */}
            <div className="flex items-start gap-4 mb-6">
                {/* Cover Art */}
                <motion.div
                    className="w-32 h-32 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center">
                        <Music className="w-16 h-16 text-white" />
                    </div>
                </motion.div>

                {/* Playlist Info */}
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {playlist.name}
                    </h3>
                    <p className="text-zinc-400 text-sm md:text-base">
                        {playlist.description}
                    </p>
                    <p className="text-zinc-500 text-xs mt-2">
                        {playlist.tracks.length} tracks · AI Generated
                    </p>
                </motion.div>
            </div>

            {/* Track List */}
            <div className="space-y-2 mb-6">
                {playlist.tracks.map((track, i) => (
                    <motion.div
                        key={`${track.title}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 text-sm w-6 flex-shrink-0">
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{track.title}</p>
                                <p className="text-zinc-400 text-sm truncate">{track.artist}</p>
                                {track.reason && (
                                    <p className="text-zinc-500 text-xs mt-1 line-clamp-1">
                                        {track.reason}
                                    </p>
                                )}
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Play className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Buttons */}
            <motion.div
                className="flex flex-wrap gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Button
                    onClick={onSave}
                    className="bg-gradient-to-r from-brand-primary to-purple-600 hover:shadow-lg hover:shadow-brand-primary/50"
                    size="lg"
                >
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Library
                </Button>

                <Button variant="outline" onClick={onEdit} size="lg">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Button>

                <Button variant="outline" onClick={onRegenerate} size="lg">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                </Button>
            </motion.div>
        </motion.div>
    );
};
