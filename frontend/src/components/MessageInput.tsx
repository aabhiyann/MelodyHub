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
		<div className='p-4 mt-auto border-t border-white/5 bg-transparent relative z-20'>
			<div className='flex items-center gap-2 bg-background-elevated/40 backdrop-blur-xl border border-white/10 rounded-3xl p-1.5 shadow-xl ring-1 ring-white/5'>
				<Textarea
					placeholder='Type a message...'
					value={newMessage}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					className='bg-transparent border-none text-text-primary placeholder:text-text-secondary focus-visible:ring-0 min-h-[42px] max-h-32 resize-none py-2.5 px-4 rounded-3xl flex-1'
				/>

				<Button
					size={'icon'}
					onClick={handleSend}
					disabled={!newMessage.trim()}
					className={`
                        rounded-full transition-all duration-300 h-9 w-9 mr-0.5 shrink-0
                        ${newMessage.trim()
							? "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg hover:scale-105"
							: "bg-background-base/50 text-text-secondary cursor-not-allowed"}
                    `}
				>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
