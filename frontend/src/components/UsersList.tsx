import UsersListSkeleton from "../layout/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/ChatStore";
import { User } from "@/types";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

	return (
		<div className='border-r border-white/5 bg-white/5 backdrop-blur-xl'>
			<div className='flex flex-col h-full'>
				<ScrollArea className='h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-4'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							users.map((user: User) => (
								<div
									key={user._id}
									onClick={() => setSelectedUser(user)}
									className={`flex items-center justify-center lg:justify-start gap-3 p-3 
										rounded-lg cursor-pointer transition-all duration-200 group
                    ${selectedUser?.clerkId === user.clerkId ? "bg-white/10 backdrop-blur-md shadow-inner" : "hover:bg-white/5"}`}
								>
									<div className='relative'>
										<Avatar className='size-8 md:size-12 border border-white/10 group-hover:scale-105 transition-transform'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										{/* online indicator */}
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-[#121212]
                        ${onlineUsers.has(user.clerkId) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-600"}`}
										/>
									</div>

									<div className='flex-1 min-w-0 lg:block hidden'>
										<span className={`font-medium truncate transition-colors ${selectedUser?.clerkId === user.clerkId ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>
											{user.fullName}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;
