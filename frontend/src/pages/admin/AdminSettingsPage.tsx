import { Sun, User, Shield, Smartphone } from 'lucide-react';
import { useAccessibilityStore } from '@/stores/AccessibilityStore';

const AdminSettingsPage = () => {
    const { highContrast, setHighContrast, largeText, setLargeText } = useAccessibilityStore();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1>
                <p className="text-text-secondary mt-1">
                    Manage your admin preferences and system configurations.
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                {/* Appearance */}
                <div className="bg-surface-card dark:bg-surface-base border border-border-subtle rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                            <Sun size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Appearance & Accessibility</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-text-primary">High Contrast Mode</p>
                                <p className="text-sm text-text-tertiary">Increase contrast for better visibility.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={highContrast}
                                    onChange={() => setHighContrast(!highContrast)}
                                />
                                <div className="w-11 h-6 bg-surface-glass-strong peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-medium after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-text-primary">Large Text</p>
                                <p className="text-sm text-text-tertiary">Increase font size across the dashboard.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={largeText}
                                    onChange={() => setLargeText(!largeText)}
                                />
                                <div className="w-11 h-6 bg-surface-glass-strong peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-medium after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Account */}
                <div className="bg-surface-card dark:bg-surface-base border border-border-subtle rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Account Settings</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-surface-glass border border-border-subtle">
                            <span className="text-sm text-text-tertiary">Email</span>
                            <p className="font-medium text-text-primary">admin@melodyhub.com</p>
                        </div>
                        <div className="p-4 rounded-lg bg-surface-glass border border-border-subtle">
                            <span className="text-sm text-text-tertiary">Role</span>
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-brand-primary" />
                                <p className="font-medium text-text-primary">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-surface-card dark:bg-surface-base border border-border-subtle rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <Smartphone size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">System Info</h2>
                    </div>
                    <div className="text-sm text-text-tertiary space-y-2">
                        <p>Version: <span className="text-text-primary font-mono">v2.4.0-admin-beta</span></p>
                        <p>Build: <span className="text-text-primary font-mono">2024.01.30</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
