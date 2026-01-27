import { Lock } from "lucide-react";

export const AchievementsList = () => {
    const achievements = [
        { id: '1', title: 'First Steps', description: 'Listen to your first song', icon: '🎵', unlocked: true, date: '2023-10-25' },
        { id: '2', title: 'Streak Master', description: 'Reach a 7-day streak', icon: '🔥', unlocked: true, date: '2023-10-30' },
        { id: '3', title: 'Genre Explorer', description: 'Listen to 5 different genres', icon: '🌍', unlocked: false, progress: 3, total: 5 },
        { id: '4', title: 'Night Owl', description: 'Listen between 2AM and 5AM', icon: '🦉', unlocked: false },
        { id: '5', title: 'Social Butterfly', description: 'Share a playlist with a friend', icon: '🦋', unlocked: false },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
                <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border flex gap-4 ${achievement.unlocked
                        ? 'bg-zinc-900/50 border-white/10'
                        : 'bg-zinc-900/20 border-white/5 opacity-70 grayscale'
                        }`}
                >
                    <div className={`size-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${achievement.unlocked ? 'bg-brand-primary/20' : 'bg-zinc-800'
                        }`}>
                        {achievement.unlocked ? achievement.icon : <Lock className="size-5 text-zinc-500" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-zinc-400'}`}>
                            {achievement.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                            {achievement.description}
                        </p>

                        {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-zinc-500"
                                    style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
                                />
                            </div>
                        )}

                        {achievement.unlocked && (
                            <p className="text-xs text-brand-primary mt-2 font-medium">Unlocked</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
