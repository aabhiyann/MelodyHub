import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    subLabel?: string;
    color: string;
    bgColor: string;
}

export const StatsCard = ({ icon: Icon, label, value, subLabel, color, bgColor }: StatsCardProps) => (
    <div className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-surface-elevated/40 transition-colors">
        <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`size-5 ${color}`} />
        </div>
        <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1">
                <h4 className="text-2xl font-bold text-white">{value}</h4>
                {subLabel != null && <span className="text-xs text-zinc-500">{subLabel}</span>}
            </div>
        </div>
    </div>
);
