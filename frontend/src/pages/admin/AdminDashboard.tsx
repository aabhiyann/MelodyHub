import { Download } from 'lucide-react';
import { useAuthStore } from '@/stores/AuthStore';
import { KPICards } from '@/components/admin/KPICards';
import { ChartsSection } from '@/components/admin/ChartsSection';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Welcome back, <span className="text-brand-primary font-medium">{user?.fullName || 'User'}</span>. Here's what's happening today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-primary transition-colors">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Custom range</option>
                    </select>

                    <button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-primary/20">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <KPICards />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Charts Area */}
                <motion.div
                    className="xl:col-span-3 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <ChartsSection />
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                    className="xl:col-span-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <ActivityFeed />
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
