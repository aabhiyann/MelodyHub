import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { UserListItem } from "@/components/social/UserListItem";

interface FollowerUser {
    _id: string;
    fullName?: string;
    imageUrl?: string;
    clerkId?: string;
}

export default function FollowersPage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<FollowerUser[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        axiosInstance
            .get(`/users/${userId}/followers?page=1&limit=20`)
            .then((res) => {
                if (res.data.success) {
                    setData(res.data.data ?? []);
                    setTotal(res.data.pagination?.total ?? 0);
                }
            })
            .catch((e) => console.error("Failed to fetch followers", e))
            .finally(() => setLoading(false));
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
                        <Users className="size-8 text-brand-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Followers</h1>
                            <p className="text-zinc-400 text-sm">{total} followers</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-zinc-500 text-center py-12">Loading...</div>
                    ) : data.length === 0 ? (
                        <div className="text-zinc-500 text-center py-12">No followers yet</div>
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
