import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatStore } from "@/stores/ChatStore";
import { useUser } from "@clerk/clerk-react";
import { Heart , Headphones , CircleUserRound  } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
	const { users, fetchUsers, onlineUsers, userActivities } = ChatStore();
	const { user } = useUser();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	return (
		<div className='h-full bg-purple-950 rounded-lg flex flex-col'>
			<div className='p-4 flex justify-between items-center border-b border-black'>
				<div className='flex items-center gap-3'>
					<CircleUserRound className='size-8' />
					<h2 className='font-semibold text-amber-100 text-2xl'>Friends</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{users.map((user) => {
						const activity = userActivities.get(user.clerkId);
						const isPlaying = activity && activity !== "Idle";

						return (
							<div
								key={user._id}
								className='cursor-pointer hover:bg-gray-500 p-3 rounded-md transition-colors group'
							>
								<div className='flex items-start gap-3'>
									<div className='relative'>
										<Avatar className='size-10 border border-zinc-100'>
											<AvatarImage src={user.imageUrl} alt={user.fullName} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
												${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-red-500"}
												`}
											aria-hidden='true'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2'>
											<span className='font-medium text-sm text-white'>{user.fullName}</span>
											{isPlaying && <Headphones  className='size-3.5 text-purple-400 shrink-0' />}
										</div>

										{isPlaying ? (
											<div className='mt-1'>
												<div className='mt-1 text-sm text-amber-100 font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-xs text-zinc-400 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
										) : (
											<div className=' text-zinc-400 tex'>Idle ...</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};
export default FriendsActivity;

const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4 '>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r  rounded-full blur-lg
       '
				aria-hidden='true'
			/>
			<div className='relative rounded-full p-4 overflow-hidden h-full bg-gradient-to-b from-gray-100 to-gray-500'>
				<Heart  className='size-8 text-purple-900 animate-pulse animate-infinite animate-alternate-reverse animate-fill-backwards' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>WELCOME TO MELODYHUB</h3>
			<p className='text-sm text-zinc-400'>Login to join your friends</p>
		</div>
	</div>
);
