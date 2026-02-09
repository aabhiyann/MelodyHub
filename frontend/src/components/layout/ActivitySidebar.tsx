import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "@/types";
import { useUser } from "@clerk/clerk-react";
import { Heart, Music, UserPlus, ListMusic } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

const ActivitySidebar = () => {
	const { user } = useUser();
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchActivities = async () => {
			if (!user) return;
			setIsLoading(true);
			try {
				const response = await axiosInstance.get("/activities");
				setActivities(response.data);
			} catch (error) {
				console.error("Failed to fetch activities:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchActivities();
	}, [user]);

	return (
		<div className='h-full bg-background-elevated/40 border-l border-white/5 flex flex-col backdrop-blur-md'>
			<div className='p-4 flex justify-between items-center border-b border-white/5'>
				<div className='flex items-center gap-3'>
					<ListMusic className='size-6 text-text-primary' />
					<h2 className='font-semibold text-text-primary text-xl'>Friend Activity</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{isLoading ? (
						<div className="text-text-secondary text-center text-sm">Loading...</div>
					) : activities.length === 0 ? (
						<div className="text-text-secondary text-center text-sm">No recent activity</div>
					) : (
						activities.map((activity) => (
							<ActivityItem key={activity._id} activity={activity} />
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
};
export default ActivitySidebar;

const ActivityItem = ({ activity }: { activity: Activity }) => {
	const { userId: actor, type, target } = activity;

	if (typeof actor === 'string') return null;

	let icon = null;
	let message = "";

	switch (type) {
		case "like_song":
			icon = <Heart className="size-3 text-red-400" fill="currentColor" />;
			message = `liked ${target?.title}`;
			break;
		case "create_playlist":
			icon = <Music className="size-3 text-blue-400" />;
			message = `created playlist ${target?.name}`;
			break;
		case "follow_user":
			icon = <UserPlus className="size-3 text-green-400" />;
			message = `followed ${target?.fullName}`;
			break;
		default:
			return null;
	}

	return (
		<div className='cursor-pointer hover:bg-white/5 p-3 rounded-md transition-all group border border-transparent hover:border-white/5'>
			<div className='flex items-start gap-3'>
				<div className='relative'>
					<Avatar className='size-10 border border-white/10'>
						<AvatarImage src={actor.imageUrl} alt={actor.fullName} />
						<AvatarFallback>{actor.fullName[0]}</AvatarFallback>
					</Avatar>
					<div className='absolute -bottom-1 -right-1 bg-background-elevated rounded-full p-0.5 border border-white/5'>
						{icon}
					</div>
				</div>

				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2'>
						<span className='font-medium text-sm text-text-primary truncate block max-w-[120px]'>{actor.fullName}</span>
					</div>

					<div className='mt-1 text-xs text-text-secondary truncate'>
						{message}
					</div>

					{type === 'like_song' && target?.artist && (
						<div className="mt-0.5 text-[10px] text-text-tertiary truncate">
							by {target.artist}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4 '>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full blur-lg opacity-40 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative rounded-full p-4 overflow-hidden bg-background-elevated/80 border border-white/10'>
				<Heart className='size-8 text-brand-primary animate-pulse' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>Join the Community</h3>
			<p className='text-sm text-text-secondary'>Login to see what your friends are listening to.</p>
		</div>
	</div>
);
