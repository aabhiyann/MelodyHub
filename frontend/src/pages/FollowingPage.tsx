import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/layout/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { UserListItem } from "@/components/features/social/UserListItem";

interface FollowingUser {
    _id: string;
    fullName?: string;
    imageUrl?: string;
    clerkId?: string;
}

export default function FollowingPage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<FollowingUser[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetchFollowing = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get<{ success: boolean; data: FollowingUser[]; pagination: typeof pagination }>(
                    `/users/${userId}/following?page=1&limit=20`
                );
                if (res.data.success) {
                    setData(res.data.data ?? []);
                    setPagination(res.data.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 });
                }
            } catch (e) {
                console.error("Failed to fetch following", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFollowing();
    }, [userId]);

    return (
        <main className="rounded-md overflow-hidden h-full bg-transparent">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="p-6 max-w-2xl mx-auto">
                    <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3 mb-6">
                        <UserPlus className="size-8 text-brand-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Following</h1>
                            <p className="text-zinc-400 text-sm">{pagination.total} following</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-zinc-500 text-center py-12">Loading...</div>
                    ) : data.length === 0 ? (
                        <div className="text-zinc-500 text-center py-12">Not following anyone yet</div>
                    ) : (
                        <div className="space-y-2">
                            {data.map((user) => (
                                <UserListItem key={user._id} user={user} showActions={false} />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </main>
    );
}
