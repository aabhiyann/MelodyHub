import { Trophy, ArrowUp, ArrowDown, Minus } from "lucide-react";

export const Leaderboard = () => {
    // Mock data
    const leagues = [
        { id: 1, name: "Diamond League", minXp: 5000 },
        { id: 2, name: "Platinum League", minXp: 3000 },
        { id: 3, name: "Gold League", minXp: 1500 },
    ];

    const currentLeague = leagues[0]; // Mock current league

    const users = [
        { id: 'u1', name: 'You', xp: 1250, rank: 4, change: 'up' },
        { id: 'u2', name: 'Alice', xp: 1400, rank: 1, change: 'same' },
        { id: 'u3', name: 'Bob', xp: 1350, rank: 2, change: 'down' },
        { id: 'u4', name: 'Charlie', xp: 1300, rank: 3, change: 'up' },
        { id: 'u5', name: 'Dave', xp: 1100, rank: 5, change: 'down' },
    ].sort((a, b) => b.xp - a.xp);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="text-yellow-400" />
                        {currentLeague.name}
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Top 10 advance to the next league!</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">4th</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Current Rank</div>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Rank</th>
                            <th className="p-4">User</th>
                            <th className="p-4 text-right">XP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user, index) => (
                            <tr key={user.id} className={`hover:bg-white/5 transition-colors ${user.name === 'You' ? 'bg-brand-primary/10' : ''}`}>
                                <td className="p-4 flex items-center gap-3">
                                    <span className={`font-bold w-6 text-center ${index < 3 ? 'text-yellow-400' : 'text-zinc-500'}`}>
                                        {index + 1}
                                    </span>
                                    {user.change === 'up' && <ArrowUp className="size-3 text-green-500" />}
                                    {user.change === 'down' && <ArrowDown className="size-3 text-red-500" />}
                                    {user.change === 'same' && <Minus className="size-3 text-zinc-600" />}
                                </td>
                                <td className="p-4 font-medium text-white">
                                    {user.name}
                                    {user.name === 'You' && <span className="ml-2 text-xs bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded-full">YOU</span>}
                                </td>
                                <td className="p-4 text-right font-mono text-zinc-300">
                                    {user.xp.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <p className="text-center text-xs text-zinc-500 mt-4">
                Leaderboards reset every Sunday at midnight.
            </p>
        </div>
    );
};
