import { useAccessibilityStore } from '@/stores/AccessibilityStore';
import { Eye, Type, Activity, Monitor } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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
                    <Switch
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                        aria-label="Toggle High Contrast Mode"
                    />
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
                    <Switch
                        checked={largeText}
                        onCheckedChange={setLargeText}
                        aria-label="Toggle Large Text Mode"
                    />
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
                    <Switch
                        checked={reducedMotion}
                        onCheckedChange={setReducedMotion}
                        aria-label="Toggle Reduced Motion"
                    />
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
                    <Switch
                        checked={screenReaderOptimized}
                        onCheckedChange={setScreenReaderOptimized}
                        aria-label="Toggle Screen Reader Optimization"
                    />
                </div>
            </div>
        </section>
    );
};
