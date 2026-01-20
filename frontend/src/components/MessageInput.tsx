import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/ChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !user || !newMessage) return;
		sendMessage(selectedUser.clerkId, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className='p-4 mt-auto border-t border-white/5 bg-white/5 backdrop-blur-md'>
			<div className='flex items-center gap-2'>
				<Input
					placeholder='Type a message...'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-brand-primary/50'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button
					size={'icon'}
					onClick={handleSend}
					disabled={!newMessage.trim()}
					className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
				>
					<Send className='size-5' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
