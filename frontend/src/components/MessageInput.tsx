import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/ChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage, sendTyping } = useChatStore();
	const lastTypingTimeRef = useRef<number>(0);

	const handleSend = () => {
		if (!selectedUser || !user || !newMessage) return;
		sendMessage(selectedUser.clerkId, newMessage.trim());
		setNewMessage("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessage(e.target.value);
		if (selectedUser) {
			const now = Date.now();
			if (now - lastTypingTimeRef.current > 2000) { // Throttle to every 2 seconds
				sendTyping(selectedUser.clerkId);
				lastTypingTimeRef.current = now;
			}
		}
	};

	return (
		<div className='p-4 mt-auto border-t border-white/5 bg-white/5 backdrop-blur-md'>
			<div className='flex items-end gap-2'>
				<Textarea
					placeholder='Type a message...'
					value={newMessage}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					className='bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-brand-primary/50 min-h-[44px] max-h-32 resize-none py-3'
				/>

				<Button
					size={'icon'}
					onClick={handleSend}
					disabled={!newMessage.trim()}
					className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 h-11 w-11 shrink-0"
				>
					<Send className='size-5' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
