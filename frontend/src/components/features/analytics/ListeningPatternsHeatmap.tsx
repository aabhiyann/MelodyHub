import { Calendar } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface ListeningPatternsHeatmapProps {
    hourOfDay: { hour: number; playCount: number }[];
    dayOfWeek: { day: string; playCount: number }[];
    mostActiveTime: string;
}

export const ListeningPatternsHeatmap = ({
    hourOfDay,
    dayOfWeek,
    mostActiveTime,
}: ListeningPatternsHeatmapProps) => {
    const maxHour = Math.max(...hourOfDay.map((h) => h.playCount), 1);
    const maxDay = Math.max(...dayOfWeek.map((d) => d.playCount), 1);

    const hourMap = Object.fromEntries(hourOfDay.map((h) => [h.hour, h.playCount]));
    const dayMap = Object.fromEntries(dayOfWeek.map((d) => [d.day, d.playCount]));

    const hasData = hourOfDay.some((h) => h.playCount > 0) || dayOfWeek.some((d) => d.playCount > 0);

    if (!hasData) {
        return (
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="size-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-white">Listening Patterns</h3>
                </div>
                <p className="text-zinc-500 text-center py-12">No pattern data yet. Keep listening!</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="size-5 text-brand-primary" />
                <h3 className="text-lg font-bold text-white">Listening Patterns</h3>
            </div>
            {mostActiveTime !== "No data" && (
                <p className="text-sm text-zinc-400 mb-4">Most active: {mostActiveTime}</p>
            )}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p className="text-xs text-zinc-500 mb-2">By hour of day</p>
                    <div className="flex flex-wrap gap-1">
                        {HOURS.map((hour) => {
                            const count = hourMap[hour] ?? 0;
                            const intensity = maxHour > 0 ? count / maxHour : 0;
                            return (
                                <div
                                    key={hour}
                                    className="size-6 rounded flex items-center justify-center text-[10px] text-zinc-300"
                                    style={{
                                        backgroundColor: `rgba(168, 85, 247, ${0.2 + intensity * 0.8})`,
                                    }}
                                    title={`${hour}:00 - ${count} plays`}
                                >
                                    {hour}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-2">By day of week</p>
                    <div className="space-y-2">
                        {DAYS.map((day) => {
                            const count = dayMap[day] ?? 0;
                            const intensity = maxDay > 0 ? count / maxDay : 0;
                            return (
                                <div key={day} className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-400 w-8">{day}</span>
                                    <div className="flex-1 h-5 rounded overflow-hidden bg-white/5">
                                        <div
                                            className="h-full bg-brand-primary/80 rounded transition-all"
                                            style={{ width: `${intensity * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-zinc-500 w-6">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
