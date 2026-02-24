import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/ChatStore";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatHeader = () => {
	const { selectedUser, onlineUsers, setSelectedUser } = useChatStore();

	if (!selectedUser) return null;

	return (
		<div className='px-2 py-3 md:p-4 border-b border-white/5 bg-background-elevated/40 backdrop-blur-md flex items-center justify-between'>
			<div className='flex items-center gap-2 md:gap-3'>
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden text-text-secondary hover:text-white hover:bg-white/10 -ml-1 size-8"
					onClick={() => setSelectedUser(null)}
				>
					<ChevronLeft className="size-5" />
				</Button>
				<Avatar className="ring-1 ring-white/10 size-9 md:size-10">
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
