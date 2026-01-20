import { useChatStore } from "@/stores/ChatStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers, activities } = useChatStore();

	return (
		<div className='border-r border-white/5 bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-2xl flex flex-col h-full w-full'>
			<div className='h-20 flex items-center px-6 border-b border-white/5 bg-white/[0.02]'>
				<div className="flex flex-col gap-1">
					<h2 className='font-semibold text-white tracking-tight flex items-center gap-2 text-lg'>
						Friends
						<span className="text-xs font-semibold text-white/50 bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
							{onlineUsers.size}
						</span>
					</h2>
					<p className="text-xs text-zinc-500 font-medium">Real-time Activity</p>
				</div>
			</div>

			<ScrollArea className='flex-1'>
				<div className='p-3 space-y-2'>
					{isLoading ? (
						Array(5).fill(0).map((_, i) => <UsersListSkeleton key={i} />)
					) : (
						users.map((user) => {
							const isOnline = onlineUsers.has(user.clerkId);
							const activity = activities.get(user.clerkId);
							const isSelected = selectedUser?.clerkId === user.clerkId;

							return (
								<div
									key={user._id}
									onClick={() => setSelectedUser(user)}
									className={`
                                        group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300
                                        ${isSelected
											? "bg-white/10 border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md border"
											: "hover:bg-white/5 border border-transparent"}
                                    `}
								>
									<div className="relative shrink-0">
										<Avatar className={`size-12 border-2 transition-transform duration-300 group-hover:scale-105 ${isSelected ? 'border-brand-primary' : 'border-transparent group-hover:border-white/20'}`}>
											<AvatarImage src={user.imageUrl} className="object-cover" />
											<AvatarFallback className="bg-zinc-800 text-white font-medium">
												{user.fullName[0]}
											</AvatarFallback>
										</Avatar>

										<span className={`
                                            absolute bottom-0 right-0 w-3.5 h-3.5 border-[3px] border-zinc-900 rounded-full transition-all duration-300
                                            ${isOnline
												? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] scale-100"
												: "bg-zinc-500 scale-0 group-hover:scale-100"}
                                        `} />
									</div>

									<div className='flex-1 min-w-0 hidden lg:block space-y-0.5'>
										<div className="flex items-center justify-between">
											<span className={`font-medium truncate text-sm transition-colors duration-200 ${isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"}`}>
												{user.fullName}
											</span>
											{isOnline && (
												<span className="text-[10px] text-emerald-400 font-medium tracking-wide mx-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase">
													Live
												</span>
											)}
										</div>
										<p className={`text-xs truncate transition-colors duration-200 font-medium ${isSelected ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"}`}>
											{activity ? (
												<span className="flex items-center gap-1 text-brand-primary">
													<span className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
													{activity}
												</span>
											) : (isOnline ? "Idle" : "Offline")}
										</p>
									</div>
								</div>
							);
						})
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default UsersList;

const UsersListSkeleton = () => (
	<div className='flex items-center gap-4 p-3 rounded-2xl animate-pulse'>
		<div className='size-12 bg-white/5 rounded-full' />
		<div className='flex-1 space-y-2 hidden lg:block'>
			<div className='h-3 bg-white/5 rounded w-24' />
			<div className='h-2 bg-white/5 rounded w-32' />
		</div>
	</div>
);
