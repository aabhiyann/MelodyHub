import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/ChatStore";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-white/5 bg-white/5 backdrop-blur-md'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium text-white'>{selectedUser.fullName}</h2>
					<p className='text-sm text-zinc-400'>
						{onlineUsers.has(selectedUser.clerkId) ? (
							<span className="text-emerald-500 font-medium">Online</span>
						) : (
							<span className="text-zinc-500">Offline</span>
						)}
					</p>
				</div>
			</div>
		</div>
	);
};
export default ChatHeader;
