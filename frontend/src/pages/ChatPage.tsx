import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/ChatStore";
import { Message } from "@/types";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "../components/UsersList";
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

			<div className='grid md:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)] rounded-xl overflow-hidden bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-lg border border-white/5'>
				<UsersList />

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
										const showDate = !previousMessage ||
											new Date(message.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString();

										return (
											<div key={message._id}>
												{showDate && (
													<div className="flex justify-center my-6">
														<span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
															{formatDate(message.createdAt)}
														</span>
													</div>
												)}

												<motion.div
													initial={{ opacity: 0, y: 10, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
													className={`flex items-end gap-3 ${isMyMessage ? "flex-row-reverse" : ""} ${isSameSender ? "mt-[2px]" : "mt-4"}`}
												>
													{/* Avatar only for first message of group */}
													<div className="size-8 flex-shrink-0">
														{!isSameSender && !isMyMessage && (
															<Avatar className='size-8 border border-white/10 shadow-sm'>
																<AvatarImage
																	src={selectedUser.imageUrl}
																/>
																<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
															</Avatar>
														)}
														{/* Spacer for alignment if no avatar */}
														{isSameSender && !isMyMessage && <div className="w-8" />}
													</div>

													<div
														className={`rounded-2xl p-3.5 max-w-[70%] shadow-sm relative group
                                                            ${isMyMessage
																? "bg-gradient-to-br from-brand-primary to-emerald-600 text-white rounded-br-none ml-12 border border-white/10"
																: "bg-white/10 text-zinc-100 rounded-bl-none mr-12 border border-white/5"
															}
                                                            ${isSameSender && isMyMessage ? "rounded-tr-md" : ""}
                                                            ${isSameSender && !isMyMessage ? "rounded-tl-md" : ""}
                                                        `}
													>
														<p className='text-[14px] leading-relaxed tracking-wide font-normal'>{message.content}</p>
														<span className={`text-[9px] mt-1 block text-right opacity-0 group-hover:opacity-100 transition-opacity ${isMyMessage ? 'text-white/70' : 'text-zinc-400'}`}>
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
