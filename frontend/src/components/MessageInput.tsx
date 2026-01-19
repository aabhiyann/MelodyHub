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
		<div className='p-4 mt-auto border-t border-[var(--color-border-primary)] glass'>
			<div className='flex items-center gap-2 '>
				<Input
					placeholder='Type here ....'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='glass border-[var(--color-border-primary)]'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button variant={'success'} shape={'pill'} size={'icon'} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-10 ' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
