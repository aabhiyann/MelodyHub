/**
 * BulkActions - Bulk action toolbar for selected rows
 * Delete, export, and other batch operations
 */

import { Trash2, Download, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BulkActionsProps {
    selectedCount: number;
    onDelete?: () => void;
    onExport?: () => void;
    className?: string;
}

export const BulkActions = ({
    selectedCount,
    onDelete,
    onExport,
    className,
}: BulkActionsProps) => {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                        'flex items-center gap-3 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg',
                        className
                    )}
                >
                    <p className='text-body-md font-semibold text-gray-900'>
                        {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                    </p>

                    <div className='flex items-center gap-2 ml-auto'>
                        {onExport && (
                            <button
                                onClick={onExport}
                                className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-body-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
                            >
                                <Download className='size-4' />
                                Export
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className='flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg text-body-sm font-medium hover:bg-error/90 transition-colors'
                            >
                                <Trash2 className='size-4' />
                                Delete
                            </button>
                        )}

                        <button className='p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                            <MoreHorizontal className='size-4 text-gray-700' />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
