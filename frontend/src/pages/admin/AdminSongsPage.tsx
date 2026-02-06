import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SongsTable } from '@/components/features/admin/SongsTable';
import { SongUploadModal } from '@/components/features/admin/SongUploadModal';
import { motion } from 'framer-motion';

import { useEffect } from 'react';
import { useMusicStore } from '@/stores/MusicStore';

const AdminSongsPage = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { fetchSongs } = useMusicStore();

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Songs Management</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage your music library, upload new tracks, and edit metadata.
                    </p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-brand-primary/20 active:scale-95 shrink-0 self-start sm:self-center"
                >
                    <Plus size={18} />
                    Add New Song
                </button>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SongsTable />
            </motion.div>

            {/* Modals */}
            <SongUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default AdminSongsPage;
