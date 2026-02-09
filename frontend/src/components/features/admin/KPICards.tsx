import { Play, Users, Music, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const kpiData = [
    {
        title: "Total Streams",
        value: "2.4M",
        change: "+12.5%",
        trend: "up",
        icon: Play,
        color: "#8B5CF6",
    },
    {
        title: "Active Users",
        value: "48.2K",
        change: "+8.1%",
        trend: "up",
        icon: Users,
        color: "#3B82F6",
    },
    {
        title: "Total Songs",
        value: "12,450",
        change: "+234",
        trend: "up",
        icon: Music,
        color: "#10B981",
    },
    {
        title: "Revenue",
        value: "$124.8K",
        change: "-2.3%",
        trend: "down",
        icon: DollarSign,
        color: "#F59E0B",
    },
];

export const KPICards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi) => (
                <div key={kpi.title} className="bg-white dark:bg-surface-base border border-border-subtle rounded-xl p-5 hover:border-brand-primary/30 dark:hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-text-tertiary">{kpi.title}</span>
                        <div
                            className="size-10 rounded-lg flex items-center justify-center transition-colors group-hover:scale-110 duration-300"
                            style={{ background: `${kpi.color}15` }}
                        >
                            <kpi.icon size={20} style={{ color: kpi.color }} />
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-text-primary mb-2 tracking-tight">
                        {kpi.value}
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className={`flex items-center gap-1 text-[13px] font-semibold px-2 py-0.5 rounded-md ${kpi.trend === "up"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                                }`}
                        >
                            {kpi.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {kpi.change}
                        </span>
                        <span className="text-xs text-text-tertiary">vs last period</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
