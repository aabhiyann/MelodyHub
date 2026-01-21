/**
 * SongsUploadTab - Complete upload interface for admin
 * Combines UploadZone and UploadForm
 */

import { useState } from 'react';
import { UploadZone } from '@/components/admin/UploadZone';
import { UploadForm } from '@/components/admin/UploadForm';
import { motion, AnimatePresence } from 'framer-motion';

export const SongsUploadTab = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFilesAccepted = (files: File[]) => {
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (files: File[], metadata: any) => {
        // TODO: Implement actual upload logic with API
        console.log('Uploading files:', files, 'with metadata:', metadata);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const handleCancel = () => {
        setSelectedFiles([]);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-heading-lg font-bold text-gray-900">Upload Songs</h2>
                <p className="text-body-md text-gray-600 mt-1">
                    Upload audio files and add metadata
                </p>
            </div>

            {/* Upload Zone */}
            <UploadZone onFilesAccepted={handleFilesAccepted} />

            {/* Upload Form - Only show when files are selected */}
            <AnimatePresence>
                {selectedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <UploadForm
                            files={selectedFiles}
                            onRemoveFile={handleRemoveFile}
                            onUpload={handleUpload}
                            onCancel={handleCancel}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
