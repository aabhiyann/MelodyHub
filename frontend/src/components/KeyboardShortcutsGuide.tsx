import { X, Keyboard, Command, Play, RotateCw, Shuffle, Heart, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useEffect } from 'react';

export const KeyboardShortcutsGuide = () => {
    const { isShortcutsGuideOpen, toggleShortcutsGuide } = usePlayerStore();

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isShortcutsGuideOpen) {
                toggleShortcutsGuide();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isShortcutsGuideOpen, toggleShortcutsGuide]);

    if (!isShortcutsGuideOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={toggleShortcutsGuide}>
            {/* Modal Content */}
            <div
                className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/20 rounded-lg">
                            <Keyboard className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                            <p className="text-sm text-zinc-400">Control MelodyHub like a pro</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleShortcutsGuide}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Shortcuts Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Playback Controls */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-2">
                            <Command className="w-4 h-4" /> Playback
                        </h3>
                        <div className="space-y-3">
                            <ShortcutRow
                                icon={<Play className="w-4 h-4" />}
                                label="Play / Pause"
                                keys={['Space', 'K']}
                            />
                            <ShortcutRow
                                icon={<SkipBack className="w-4 h-4" />}
                                label="Seek Backward 5s"
                                keys={['←', 'J']}
                            />
                            <ShortcutRow
                                icon={<SkipForward className="w-4 h-4" />}
                                label="Seek Forward 5s"
                                keys={['→', 'L']}
                            />
                        </div>
                    </div>

                    {/* Audio Controls */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                            <Volume2 className="w-4 h-4" /> Audio & Social
                        </h3>
                        <div className="space-y-3">
                            <ShortcutRow
                                icon={<Volume2 className="w-4 h-4" />}
                                label="Volume Up/Down"
                                keys={['↑', '↓']}
                            />
                            <ShortcutRow
                                icon={<Volume2 className="w-4 h-4" />} // Mute icon would be better if dynamic, but Volume2 is fine for generic
                                label="Mute Toggle"
                                keys={['M']}
                            />
                            <ShortcutRow
                                icon={<Heart className="w-4 h-4" />}
                                label="Like Song"
                                keys={['Shift', 'L']}
                            />
                        </div>
                    </div>

                    {/* Queue Management */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            <RotateCw className="w-4 h-4" /> Queue Controls
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ShortcutRow
                                icon={<Shuffle className="w-4 h-4" />}
                                label="Shuffle Toggle"
                                keys={['S']}
                            />
                            <ShortcutRow
                                icon={<RotateCw className="w-4 h-4" />}
                                label="Repeat Toggle"
                                keys={['R']}
                            />
                            <ShortcutRow
                                icon={<Keyboard className="w-4 h-4" />}
                                label="Show/Hide Guide"
                                keys={['?']}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShortcutRow = ({ icon, label, keys }: { icon: React.ReactNode, label: string, keys: string[] }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors">
            <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{icon}</span>
            <span className="font-medium">{label}</span>
        </div>
        <div className="flex gap-1">
            {keys.map((key, i) => (
                <kbd key={i} className="px-2 py-1 min-w-[24px] text-center text-xs font-semibold bg-zinc-800 border-b-2 border-zinc-700 rounded text-zinc-400 group-hover:text-white group-hover:bg-zinc-700/80 group-hover:border-zinc-600 transition-all">
                    {key}
                </kbd>
            ))}
        </div>
    </div>
);
