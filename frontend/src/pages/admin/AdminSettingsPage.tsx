import { Sun, User, Shield, Smartphone } from 'lucide-react';
import { useAccessibilityStore } from '@/stores/AccessibilityStore';

const AdminSettingsPage = () => {
    const { highContrast, setHighContrast, largeText, setLargeText } = useAccessibilityStore();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage your admin preferences and system configurations.
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                {/* Appearance */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                            <Sun size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Appearance & Accessibility</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-zinc-900 dark:text-white">High Contrast Mode</p>
                                <p className="text-sm text-zinc-500">Increase contrast for better visibility.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={highContrast}
                                    onChange={() => setHighContrast(!highContrast)}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 dark:peer-focus:ring-brand-primary/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-zinc-900 dark:text-white">Large Text</p>
                                <p className="text-sm text-zinc-500">Increase font size across the dashboard.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={largeText}
                                    onChange={() => setLargeText(!largeText)}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 dark:peer-focus:ring-brand-primary/20 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Account */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Account Settings</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                            <span className="text-sm text-zinc-500">Email</span>
                            <p className="font-medium text-zinc-900 dark:text-white">admin@melodyhub.com</p>
                        </div>
                        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                            <span className="text-sm text-zinc-500">Role</span>
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-brand-primary" />
                                <p className="font-medium text-zinc-900 dark:text-white">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <Smartphone size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">System Info</h2>
                    </div>
                    <div className="text-sm text-zinc-500 space-y-2">
                        <p>Version: <span className="text-zinc-900 dark:text-white font-mono">v2.4.0-admin-beta</span></p>
                        <p>Build: <span className="text-zinc-900 dark:text-white font-mono">2024.01.30</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
