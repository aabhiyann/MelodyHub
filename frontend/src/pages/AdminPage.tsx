import { useAuthStore } from "@/stores/AuthStore";
import Header from "../components/AdminHeader";
import DashboardStats from "../components/DashboardStats";
import { Album, Music, BarChart3, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "../components/SongsTabContent";
import AlbumsTabContent from "../components/AlbumsTabContent";
import AnalyticsTabContent from "./admin/components/AnalyticsTabContent";
import { UsersTab } from "./admin/UsersTab";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/MusicStore";

const AdminPage = () => {
    const { isAdmin, isLoading } = useAuthStore();

    const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

    useEffect(() => {
        fetchAlbums();
        fetchSongs();
        fetchStats();
    }, [fetchAlbums, fetchSongs, fetchStats]);

    if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

    return (
        <div className='min-h-full bg-transparent flex flex-col p-6 space-y-8'>
            <Header />

            <div className="space-y-8">
                <DashboardStats />
            </div>

            <Tabs defaultValue='songs' className='space-y-6'>
                <TabsList className='bg-white/5 backdrop-blur-lg border border-white/5 p-1 h-12 rounded-xl w-auto inline-flex'>
                    <TabsTrigger
                        value='songs'
                        className='data-[state=active]:bg-brand-primary data-[state=active]:text-white text-zinc-400 hover:text-white transition-colors h-10 px-6 rounded-lg'
                    >
                        <Music className='mr-2 size-4' />
                        Songs
                    </TabsTrigger>
                    <TabsTrigger
                        value='albums'
                        className='data-[state=active]:bg-brand-primary data-[state=active]:text-white text-zinc-400 hover:text-white transition-colors h-10 px-6 rounded-lg'
                    >
                        <Album className='mr-2 size-4' />
                        Albums
                    </TabsTrigger>
                    <TabsTrigger
                        value='analytics'
                        className='data-[state=active]:bg-brand-primary data-[state=active]:text-white text-zinc-400 hover:text-white transition-colors h-10 px-6 rounded-lg'
                    >
                        <BarChart3 className='mr-2 size-4' />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger
                        value='users'
                        className='data-[state=active]:bg-brand-primary data-[state=active]:text-white text-zinc-400 hover:text-white transition-colors h-10 px-6 rounded-lg'
                    >
                        <Users className='mr-2 size-4' />
                        Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='songs' className="outline-none focus:outline-none">
                    <SongsTabContent />
                </TabsContent>
                <TabsContent value='albums' className="outline-none focus:outline-none">
                    <AlbumsTabContent />
                </TabsContent>
                <TabsContent value='analytics' className="outline-none focus:outline-none">
                    <AnalyticsTabContent />
                </TabsContent>
                <TabsContent value='users' className="outline-none focus:outline-none">
                    <UsersTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default AdminPage;
