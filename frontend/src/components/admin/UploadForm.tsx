/**
 * UploadForm - Form for song metadata and upload management
 * Includes file preview, progress, and validation
 */

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ValidatedInput } from '@/components/ui/form-feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';



interface UploadFormProps {
    files: File[];
    onRemoveFile: (index: number) => void;
    onUpload: (files: File[], metadata: SongMetadata) => Promise<void>;
    onCancel: () => void;
}

interface SongMetadata {
    title: string;
    artist: string;
    album?: string;
    genre?: string;
}

export const UploadForm = ({ files, onRemoveFile, onUpload, onCancel }: UploadFormProps) => {
    const [metadata, setMetadata] = useState<SongMetadata>({
        title: '',
        artist: '',
        album: '',
        genre: '',
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!metadata.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!metadata.artist.trim()) {
            newErrors.artist = 'Artist is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpload = async () => {
        if (!validateForm()) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 200);

            await onUpload(files, metadata);

            clearInterval(progressInterval);
            setUploadProgress(100);

            setTimeout(() => {
                setIsUploading(false);
                onCancel();
            }, 1000);
        } catch (error) {
            setIsUploading(false);
            setUploadProgress(0);
            // Handle error
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <Card className="bg-white border-border">
            <CardHeader>
                <CardTitle className="text-heading-md font-bold text-gray-900">
                    Upload Details
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* File List */}
                <div className="space-y-2">
                    <label className="text-body-md font-medium text-gray-900">
                        Files ({files.length})
                    </label>
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-body-md font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-body-sm text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onRemoveFile(index)}
                                    disabled={isUploading}
                                    className="p-1 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    <X className="size-4 text-gray-500" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Metadata Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput
                        label="Song Title *"
                        value={metadata.title}
                        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                        error={errors.title}
                        disabled={isUploading}
                        placeholder="Enter song title"
                    />
                    <ValidatedInput
                        label="Artist *"
                        value={metadata.artist}
                        onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
                        error={errors.artist}
                        disabled={isUploading}
                        placeholder="Enter artist name"
                    />
                    <ValidatedInput
                        label="Album"
                        value={metadata.album}
                        onChange={(e) => setMetadata({ ...metadata, album: e.target.value })}
                        disabled={isUploading}
                        placeholder="Enter album name (optional)"
                    />
                    <ValidatedInput
                        label="Genre"
                        value={metadata.genre}
                        onChange={(e) => setMetadata({ ...metadata, genre: e.target.value })}
                        disabled={isUploading}
                        placeholder="Enter genre (optional)"
                    />
                </div>

                {/* Upload Progress */}
                <AnimatePresence>
                    {isUploading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between text-body-sm">
                                <span className="text-gray-700 font-medium">Uploading...</span>
                                <span className="text-gray-600">{uploadProgress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-brand-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || files.length === 0}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
                            'bg-brand-primary text-white hover:bg-brand-primary/90',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        {isUploading ? (
                            <>
                                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="size-4" />
                                Upload {files.length} file{files.length > 1 ? 's' : ''}
                            </>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isUploading}
                        className="px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};
