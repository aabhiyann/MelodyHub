import { useState, useMemo } from 'react';
import {
    Search, Edit, Trash2, Play, ChevronLeft, ChevronRight,
    ArrowUpDown, X
} from 'lucide-react';
import { useMusicStore } from '@/stores/MusicStore';
import { Song } from '@/types';
import { formatDuration } from '@/utils/formatTime';
import { format } from 'date-fns';

export const SongsTable = () => {
    const { songs } = useMusicStore();
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Keeping state for future resilience
    const [sortConfig, setSortConfig] = useState<{ key: keyof Song | 'dateAdded'; direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });
    const [filters, setFilters] = useState({
        search: "",
        genre: "",
        status: "",
    });

    // --- Derived State (Filtering & Sorting) ---
    const filteredSongs = useMemo(() => {
        let result = [...songs];

        // Filter: Search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(song =>
                song.title.toLowerCase().includes(q) ||
                song.artist.toLowerCase().includes(q) ||
                (typeof song.albumId === 'string' && song.albumId.toLowerCase().includes(q))
            );
        }

        // Filter: Genre
        if (filters.genre) {
            const g = filters.genre.toLowerCase();
            result = result.filter(song => song.genre && song.genre.toLowerCase() === g);
        }

        // Sort
        result.sort((a, b) => {
            // @ts-ignore - Dynamic key access simplification for sorting
            const aValue = a[sortConfig.key] || '';
            // @ts-ignore
            const bValue = b[sortConfig.key] || '';

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [songs, filters, sortConfig]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredSongs.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredSongs.length);
    const currentSongs = filteredSongs.slice(startIndex, endIndex);

    // Handlers
    const handleSort = (key: keyof Song | 'dateAdded') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const toggleSelectAll = () => {
        if (selectedRows.size === currentSongs.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(currentSongs.map(s => s._id)));
        }
    };

    const toggleSelectRow = (id: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden flex flex-col shadow-sm">
            {/* Toolbar */}
            <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="search"
                            placeholder="Search songs..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full h-9 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:border-brand-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Filter Dropdowns (Mock) */}
                    <select
                        className="h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:border-brand-primary outline-none shadow-sm"
                        value={filters.genre}
                        onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                    >
                        <option value="">All Genres</option>
                        <option value="pop">Pop</option>
                        <option value="rock">Rock</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {selectedRows.size > 0 && (
                        <div className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-right-4">
                            <span>{selectedRows.size} selected</span>
                            <div className="h-4 w-px bg-brand-primary/20 mx-1" />
                            <button className="hover:text-brand-secondary transition-colors"><Trash2 size={14} /></button>
                            <button className="hover:text-brand-secondary transition-colors"><X size={14} onClick={() => setSelectedRows(new Set())} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold tracking-wider border-b border-zinc-200 dark:border-white/5">
                            <th className="p-4 w-[40px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-zinc-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                    checked={currentSongs.length > 0 && selectedRows.size === currentSongs.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('title')}>
                                <div className="flex items-center gap-2">Title <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('artist')}>
                                <div className="flex items-center gap-2">Artist <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors" onClick={() => handleSort('albumId')}>
                                <div className="flex items-center gap-2">Album <ArrowUpDown size={12} /></div>
                            </th>
                            <th className="p-4 text-center">Duration</th>
                            <th className="p-4 text-right">Date Added</th>
                            <th className="p-4 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                        {currentSongs.map((song) => (
                            <tr
                                key={song._id}
                                className={`group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors ${selectedRows.has(song._id) ? "bg-brand-primary/5 dark:bg-brand-primary/10" : ""}`}
                            >
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-zinc-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                        checked={selectedRows.has(song._id)}
                                        onChange={() => toggleSelectRow(song._id)}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative size-10 rounded overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow">
                                            <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                                <Play size={16} className="text-white fill-current" />
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-zinc-900 dark:text-white truncate max-w-[200px]">{song.title}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{song.artist}</td>
                                <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{song.albumId || '-'}</td>
                                <td className="p-4 text-sm text-zinc-500 font-mono text-center">{formatDuration(song.duration)}</td>
                                <td className="p-4 text-sm text-zinc-500 text-right whitespace-nowrap">
                                    {/* Mock date if createdAt logic isn't consistent yet */}
                                    {format(new Date(), 'MMM d, yyyy')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentSongs.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-zinc-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search size={32} className="opacity-20" />
                                        <p>No songs found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <span className="text-xs text-zinc-500">
                    Showing {startIndex + 1}-{endIndex} of {filteredSongs.length} songs
                </span>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Simple page logic for now
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    className={`size-7 text-xs font-medium rounded-md flex items-center justify-center transition-colors ${currentPage === p
                                        ? "bg-brand-primary text-white shadow-sm"
                                        : "hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400"
                                        }`}
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
