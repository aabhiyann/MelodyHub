import Topbar from "@/components/layout/TopBar";
import { useEffect } from "react";
import { useChatStore } from "@/stores/ChatStore";
import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageInput } from "@/components/features/chat/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendsList } from "@/components/features/social/FriendsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import { MascotImage } from "@/components/shared/MascotImage";
import { motion } from "framer-motion";
import { SectionErrorBoundary } from "@/components/shared/SectionErrorBoundary";
import { useUser } from "@clerk/clerk-react";


const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const {
		users: chatUsers,
		selectedUser,
		messages,
		fetchUsers,
		fetchMessages,
		setSelectedUser,
		typingUsers,
		onlineUsers
	} = useChatStore();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	return (
		<div className='h-full flex flex-col rounded-lg overflow-hidden bg-transparent'>
			<Topbar />

			<div className='grid md:grid-cols-[300px_1fr] grid-cols-[80px_1fr] flex-1 min-h-0 rounded-xl overflow-hidden bg-background-elevated/40 backdrop-blur-lg border border-white/5'>
				<SectionErrorBoundary sectionName="Friends List">
					<FriendsList />
				</SectionErrorBoundary>

				<div className='flex flex-col h-full bg-white/[0.02] backdrop-blur-md relative min-h-0 overflow-hidden'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='flex-1 w-full min-h-0'>
								<div className='p-4 space-y-4 min-h-0 pb-12'>
									{messages.map((message: Message, index) => {
										const isMyMessage = message.senderId === user?.id;
										const previousMessage = messages[index - 1];
										const isSameSender = previousMessage?.senderId === message.senderId;
										const isSequential = isSameSender && (
											new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60 * 1000
										);
										const showDate = !previousMessage ||
											new Date(message.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString();

										return (
											<div key={message._id}>
												{showDate && (
													<div className="flex justify-center my-6">
														<span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
															{formatDate(message.createdAt)}
														</span>
													</div>
												)}

												<motion.div
													initial={{ opacity: 0, scale: 0.9, y: 10 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													transition={{ type: "spring", stiffness: 400, damping: 25 }}
													className={`flex items-end gap-2 mb-1 ${isMyMessage ? "justify-end" : "justify-start"}`}
												>
													<div className={`size-7 flex-shrink-0 ${isMyMessage ? 'order-2' : 'order-1'}`}>
														{!isMyMessage && !isSequential && (
															<Avatar className='size-7 border border-white/10 shadow-sm ring-1 ring-white/5'>
																<AvatarImage src={selectedUser.imageUrl} className="object-cover" />
																<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
															</Avatar>
														)}
													</div>

													<div className={`relative max-w-[70%] group ${isMyMessage ? 'order-1' : 'order-2'}`}>
														<div className={`px-4 py-2 text-[15px] leading-relaxed shadow-sm ${isMyMessage
															? "bg-brand-primary text-white rounded-2xl rounded-br-none shadow-md"
															: "bg-background-elevated/80 text-text-primary rounded-2xl rounded-bl-none border border-white/5 shadow-sm"
															}`}>
															<p>{message.content}</p>
														</div>
														<span className={`text-[9px] text-text-secondary absolute bottom-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none pointer-events-none w-max ${isMyMessage ? "right-full mr-2" : "left-full ml-2"}`}>
															{formatTime(message.createdAt)}
														</span>
													</div>
												</motion.div>
											</div>
										);
									})}

									{/* Anchor for auto-scroll if needed, or just bottom spacing */}
									<div className="h-2" />
								</div>
							</ScrollArea>

							{/* Typing Indicator & Input Area Container */}
							<div className="relative w-full z-10">
								<MessageInput />
							</div>
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</div>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6 rounded-3xl overflow-hidden bg-white/5 border border-white/5 backdrop-blur-3xl shadow-2xl'>
		{/* Melody chatting mascot */}
		<MascotImage
			state='chatting'
			size='lg'
			className='drop-shadow-xl'
		/>

		<div className='text-center '>
			<h3 className='text-white text-2xl font-bold mb-2 tracking-tight'>Happy Chatting</h3>
			<p className='text-text-secondary text-base max-w-xs'>Select a friend from the sidebar to start a conversation</p>
		</div>
	</div>
);
