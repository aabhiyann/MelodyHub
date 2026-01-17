import { useAuthStore } from "@/stores/AuthStore";
import Header from "../components/AdminHeader";
import DashboardStats from "../components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "../components/SongsTabContent";
import AlbumsTabContent from "../components/AlbumsTabContent";
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
        <div
            className='rounded-md overflow-hidden h-full bg-gradient-to-b from-gray-300 to-gray-500'
        >
            <Header />

            <DashboardStats />

            <Tabs defaultValue='songs' className='space-y-6'>
                <TabsList className='p-1 bg-zinc-800/50'>
                    <TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 text-amber-50'>
                        <Music className='mr-2 size-4' />
                        Songs
                    </TabsTrigger>
                    <TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 text-amber-50'>
                        <Album className='mr-2 size-4' />
                        Albums
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='songs'>
                    <SongsTabContent />
                </TabsContent>
                <TabsContent value='albums'>
                    <AlbumsTabContent />
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default AdminPage;
