import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/ChatStore";
import { Message } from "@/types";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import FriendsList from "../components/FriendsList";
import ChatHeader from "../components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageInput from "../components/MessageInput";
import { MascotImage } from "@/components/MascotImage";
import { motion } from "framer-motion";

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
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	return (
		<main className='h-full rounded-lg overflow-hidden bg-transparent'>
			<Topbar />

			<div className='grid md:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)] rounded-xl overflow-hidden bg-gradient-to-b from-background-elevated/40 to-background-base/20 backdrop-blur-lg border border-white/5'>
				<FriendsList />

				{/* chat message */}
				<div className='flex flex-col h-full bg-white/[0.02] backdrop-blur-md relative'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-340px)] w-full'>
								<div className='p-4 space-y-4 min-h-0'>
									{messages.map((message: Message, index) => {
										const isMyMessage = message.senderId === user?.id;
										const previousMessage = messages[index - 1];
										const isSameSender = previousMessage?.senderId === message.senderId;
										// Group messages under same sender if < 5 mins apart
										const isSequential = isSameSender && (
											new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60 * 1000
										);

										const showDate = !previousMessage ||
											new Date(message.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString();

										return (
											<div key={message._id}>
												{showDate && (
													<div className="flex justify-center my-6">
														<span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
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
													{/* Avatar showing/hiding based on sequence */}
													<div className={`size-7 flex-shrink-0 ${isMyMessage ? 'order-2' : 'order-1'}`}>
														{!isMyMessage && !isSequential && (
															<Avatar className='size-7 border border-white/10 shadow-sm ring-1 ring-white/5'>
																<AvatarImage
																	src={selectedUser.imageUrl}
																	className="object-cover"
																/>
																<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
															</Avatar>
														)}
													</div>

													{/* Message Bubble */}
													<div className={`relative max-w-[70%] group ${isMyMessage ? 'order-1' : 'order-2'}`}>
														<div
															className={`px-4 py-2 text-[15px] leading-relaxed shadow-sm
                                                                ${isMyMessage
																	? "bg-brand-primary text-white rounded-2xl rounded-br-sm shadow-md"
																	: "bg-background-elevated/80 text-text-primary rounded-2xl rounded-bl-sm border border-white/5 shadow-sm"
																}
                                                            `}
														>
															<p>{message.content}</p>
														</div>

														{/* Timestamp visible on hover, outside bubble */}
														<span className={`text-[9px] text-zinc-500 absolute bottom-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none pointer-events-none w-max
															${isMyMessage ? "right-full mr-2" : "left-full ml-2"}`}>
															{formatTime(message.createdAt)}
														</span>
													</div>
												</motion.div>
											</div>
										);
									})}
								</div>
							</ScrollArea>

							{/* Typing Indicator */}
							<div className="absolute bottom-20 left-6 z-10 w-full pointer-events-none">
								{selectedUser && useChatStore.getState().typingUsers?.has(selectedUser.clerkId) && (
									<div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 animate-in slide-in-from-bottom-2 fade-in duration-300 w-fit pointer-events-auto shadow-lg">
										<div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
										<div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
										<div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
										<span className="text-xs text-zinc-300 ml-1.5 font-medium">{selectedUser.fullName} is typing...</span>
									</div>
								)}
							</div>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
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
			<p className='text-zinc-400 text-base max-w-xs'>Select a friend from the sidebar to start a conversation</p>
		</div>
	</div>
);
