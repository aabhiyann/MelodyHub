/**
 * UploadZone - Drag & drop file upload area
 * Support for audio files with visual feedback
 */

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, FileAudio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';



interface UploadZoneProps {
    onFilesAccepted: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // in MB
    acceptedFormats?: string[];
    className?: string;
}

const ACCEPTED_AUDIO_FORMATS = {
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/flac': ['.flac'],
    'audio/m4a': ['.m4a'],
    'audio/ogg': ['.ogg'],
};

export const UploadZone = ({
    onFilesAccepted,
    maxFiles = 10,
    maxSize = 50, // 50MB default
    className,
}: UploadZoneProps) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFilesAccepted(acceptedFiles);
        },
        [onFilesAccepted]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
    } = useDropzone({
        onDrop,
        accept: ACCEPTED_AUDIO_FORMATS,
        maxFiles,
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
        multiple: maxFiles > 1,
    });

    return (
        <div className={cn('w-full', className)}>
            <motion.div
                {...(getRootProps() as any)}
                // @ts-ignore - Dropzone props are compatible but TS complains about onAnimationStart mismatch
                className={cn(
                    'relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
                    'hover:border-brand-primary hover:bg-brand-primary/5',
                    isDragActive && !isDragReject && 'border-brand-primary bg-brand-primary/10',
                    isDragReject && 'border-error bg-error/10',
                    !isDragActive && 'border-gray-300 bg-white'
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {isDragActive ? (
                        <motion.div
                            key="dragging"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-brand-primary/20">
                                <Upload className={cn(
                                    'size-8',
                                    isDragReject ? 'text-error' : 'text-brand-primary'
                                )} />
                            </div>
                            <div>
                                <p className={cn(
                                    'text-heading-md font-semibold',
                                    isDragReject ? 'text-error' : 'text-brand-primary'
                                )}>
                                    {isDragReject ? 'Invalid file type' : 'Drop files here'}
                                </p>
                                <p className="text-body-sm text-gray-500 mt-2">
                                    {isDragReject
                                        ? 'Only audio files are accepted'
                                        : 'Release to upload your audio files'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                                <Music className="size-8 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-heading-md font-semibold text-gray-900">
                                    Drag & drop audio files
                                </p>
                                <p className="text-body-md text-gray-600 mt-2">
                                    or <span className="text-brand-primary font-medium">browse</span> to choose files
                                </p>
                                <p className="text-body-sm text-gray-500 mt-4">
                                    Supports MP3, WAV, FLAC, M4A, OGG (max {maxSize}MB)
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* File format icons */}
                <div className="flex items-center justify-center gap-4 mt-6 opacity-40">
                    {['MP3', 'WAV', 'FLAC'].map((format) => (
                        <div key={format} className="flex items-center gap-1 text-body-xs text-gray-500">
                            <FileAudio className="size-3" />
                            <span>{format}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Error messages */}
            {fileRejections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg"
                >
                    <p className="text-body-sm font-medium text-error">
                        {fileRejections.length} file(s) rejected:
                    </p>
                    <ul className="mt-2 space-y-1">
                        {fileRejections.map(({ file, errors }) => (
                            <li key={file.name} className="text-body-sm text-gray-700">
                                <span className="font-medium">{file.name}</span>
                                {' - '}
                                {errors.map((e) => e.message).join(', ')}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
};
