import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/ChatStore";

export const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-white/5 bg-background-elevated/40 backdrop-blur-md'>
			<div className='flex items-center gap-3'>
				<Avatar className="ring-1 ring-white/10">
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium text-text-primary'>{selectedUser.fullName}</h2>
					<p className='text-xs text-text-secondary'>
						{onlineUsers.has(selectedUser.clerkId) ? (
							<span className="text-emerald-500 font-medium">Online</span>
						) : (
							<span className="text-text-disabled">Offline</span>
						)}
					</p>
				</div>
			</div>
		</div>
	);
};
