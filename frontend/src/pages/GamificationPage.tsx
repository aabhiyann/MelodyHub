import { useGamificationStore } from "@/stores/GamificationStore";
import { DailyChallengeCard } from "@/components/features/gamification/DailyChallengeCard";
import { Leaderboard } from "@/components/features/gamification/Leaderboard";
import { AchievementsList } from "@/components/features/gamification/AchievementsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Target, Medal, Store } from "lucide-react";

const GamificationPage = () => {
    const { xp, level, gems, dailyChallenges } = useGamificationStore();

    // Mock data for now if store is empty/loading
    const challenges = dailyChallenges.length > 0 ? dailyChallenges : [
        {
            id: 'mock1',
            type: 'listen_count',
            target: 5,
            progress: 2,
            completed: false,
            reward: { xp: 50, gems: 10 }
        },
        {
            id: 'mock2',
            type: 'login',
            target: 1,
            progress: 1,
            completed: true,
            reward: { xp: 20, gems: 5 }
        }
    ];

    return (
        <div className="h-full flex flex-col p-6 space-y-6">
            {/* Header / Hero Section */}
            <div className="flex flex-col md:flex-row items-end justify-between bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 mask-image-gradient" />

                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative">
                        <div className="size-24 rounded-full bg-zinc-800 border-4 border-yellow-500/50 flex items-center justify-center text-4xl font-bold text-yellow-500 shadow-xl shadow-yellow-500/20">
                            {level}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-zinc-900 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                            LVL
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white">Your Progress</h1>
                        <div className="flex items-center gap-4 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 font-bold">{xp}</span> XR
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-bold">{gems}</span> Gems
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="quests" className="flex-1 flex flex-col min-h-0">
                <TabsList className="bg-zinc-900/50 border border-white/5 p-1 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="quests" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                        <Target className="mr-2 size-4" />
                        Quests
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                        <Trophy className="mr-2 size-4" />
                        Leaderboard
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                        <Medal className="mr-2 size-4" />
                        Achievements
                    </TabsTrigger>
                    <TabsTrigger value="shop" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                        <Store className="mr-2 size-4" />
                        Shop
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 mt-4">
                    <ScrollArea className="h-full">
                        <TabsContent value="quests" className="m-0 space-y-4">
                            <h2 className="text-xl font-bold mb-4">Daily Quests</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {challenges.map(challenge => (
                                    <DailyChallengeCard key={challenge.id} challenge={challenge} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="leaderboard" className="m-0">
                            <Leaderboard />
                        </TabsContent>

                        <TabsContent value="achievements" className="m-0">
                            <AchievementsList />
                        </TabsContent>
                        <TabsContent value="shop" className="m-0">
                            <div className="flex flex-col items-center justify-center p-12 text-zinc-500 border border-dashed border-zinc-700 rounded-xl">
                                <Store className="size-16 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">Gem Shop Coming Soon</h3>
                                <p>Spend your gems on cool rewards!</p>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    );
};

export default GamificationPage;
