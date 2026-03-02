import { useRef, useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/AccessibilityStore';
import { X, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutGroup {
    category: string;
    shortcuts: { keys: string[]; description: string }[];
}

const SHORTCUTS: ShortcutGroup[] = [
    {
        category: "Playback",
        shortcuts: [
            { keys: ["Space"], description: "Play / Pause" },
            { keys: ["→"], description: "Next Track" },
            { keys: ["←"], description: "Previous Track (or Rewind)" },
            { keys: ["↑"], description: "Volume Up" },
            { keys: ["↓"], description: "Volume Down" },
            { keys: ["M"], description: "Mute / Unmute" },
            { keys: ["R"], description: "Toggle Repeat" },
            { keys: ["S"], description: "Shuffle Queue" },
        ]
    },
    {
        category: "General",
        shortcuts: [
            { keys: ["?"], description: "Show Shortcuts" },
            { keys: ["Esc"], description: "Close Menu / Modal" },
        ]
    }
];

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
    const { highContrast, largeText } = useAccessibilityStore();
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap implementation
    useEffect(() => {
        if (!isOpen) return;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !modalRef.current) return;

            const focusables = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusables.length === 0) return;

            const firstElement = focusables[0] as HTMLElement;
            const lastElement = focusables[focusables.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleTab);
        document.addEventListener('keydown', handleEscape);

        // Initial focus
        const Timer = setTimeout(() => {
            const closeBtn = modalRef.current?.querySelector('button');
            closeBtn?.focus();
        }, 100);

        return () => {
            document.removeEventListener('keydown', handleTab);
            document.removeEventListener('keydown', handleEscape);
            clearTimeout(Timer);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />

                {/* Modal Content */}
                <motion.div
                    ref={modalRef}
                    role="dialog"
                    aria-label="Keyboard Shortcuts"
                    aria-modal="true"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className={`
                        relative w-full max-w-2xl max-h-[90dvh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col
                        ${highContrast ? 'border-2 border-white' : ''}
                        ${largeText ? 'text-lg' : 'text-base'}
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/20 rounded-lg">
                                <Keyboard className="size-6 text-brand-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Close shortcuts modal"
                        >
                            <X className="size-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid gap-8 md:grid-cols-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden touch-scroll">
                        {SHORTCUTS.map((group) => (
                            <div key={group.category} className="space-y-4">
                                <h3 className={`font-semibold text-brand-primary tracking-wide uppercase text-sm`}>
                                    {group.category}
                                </h3>
                                <ul className="space-y-3">
                                    {group.shortcuts.map((shortcut) => (
                                        <li key={shortcut.description} className="flex items-center justify-between">
                                            <span className="text-white/70">{shortcut.description}</span>
                                            <div className="flex gap-1">
                                                {shortcut.keys.map((key) => (
                                                    <kbd
                                                        key={key}
                                                        className={`
                                                            px-2 py-1 bg-white/10 rounded min-w-[28px] text-center font-mono text-sm text-white border-b-2 border-white/10
                                                            ${highContrast ? 'bg-white text-black font-bold' : ''}
                                                        `}
                                                    >
                                                        {key}
                                                    </kbd>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-zinc-950/50 border-t border-white/10 text-center text-sm text-white/40">
                        Press <kbd className="font-mono text-white/60">Esc</kbd> to close
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
