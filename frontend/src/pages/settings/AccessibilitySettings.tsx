import { useAccessibilityStore } from '@/stores/AccessibilityStore';
import { Eye, Type, Activity, Monitor } from 'lucide-react';

export const AccessibilitySettings = () => {
    const {
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        reducedMotion,
        setReducedMotion,
        screenReaderOptimized,
        setScreenReaderOptimized
    } = useAccessibilityStore();

    return (
        <section className="space-y-6" aria-labelledby="a11y-heading">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-primary/20 rounded-lg">
                    <Eye className="size-6 text-brand-primary" />
                </div>
                <div>
                    <h2 id="a11y-heading" className="text-2xl font-bold text-white">Accessibility & Inclusion</h2>
                    <p className="text-white/50 text-sm">Customize your experience to fit your needs</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden">
                {/* High Contrast */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Eye className="size-5 text-white/70" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">High Contrast</h3>
                            <p className="text-sm text-white/50">Increases contrast for better visibility</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={highContrast}
                            onChange={(e) => setHighContrast(e.target.checked)}
                            aria-label="Toggle High Contrast Mode"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                </div>

                {/* Large Text */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Type className="size-5 text-white/70" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Large Text</h3>
                            <p className="text-sm text-white/50">Increases font size by 10%</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={largeText}
                            onChange={(e) => setLargeText(e.target.checked)}
                            aria-label="Toggle Large Text Mode"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                </div>

                {/* Reduced Motion */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Activity className="size-5 text-white/70" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Reduced Motion</h3>
                            <p className="text-sm text-white/50">Minimizes animations and transitions</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={reducedMotion}
                            onChange={(e) => setReducedMotion(e.target.checked)}
                            aria-label="Toggle Reduced Motion"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                </div>

                {/* Screen Reader Optimized */}
                <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Monitor className="size-5 text-white/70" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Screen Reader Optimization</h3>
                            <p className="text-sm text-white/50">Simplifies layout and linearizes content</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={screenReaderOptimized}
                            onChange={(e) => setScreenReaderOptimized(e.target.checked)}
                            aria-label="Toggle Screen Reader Optimization"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                </div>
            </div>
        </section>
    );
};
