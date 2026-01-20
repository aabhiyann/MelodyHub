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

	console.log({ messages });

	return (
		<main className='h-full rounded-lg overflow-hidden bg-transparent'>
			<Topbar />

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)] rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/5'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full bg-white/5 backdrop-blur-md relative'>
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
													<div className="flex justify-center my-4">
														<span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-full">
															{formatDate(message.createdAt)}
														</span>
													</div>
												)}

												<motion.div
													initial={{ opacity: 0, y: 10, scale: 0.9 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													transition={{ duration: 0.3, delay: index * 0.05 }}
													className={`flex items-end gap-3 ${isMyMessage ? "flex-row-reverse" : ""} ${isSameSender ? "mt-[2px]" : "mt-4"}`}
												>
													{/* Avatar only for first message of group */}
													<div className="size-8 flex-shrink-0">
														{!isSameSender && (
															<Avatar className='size-8 border border-white/10'>
																<AvatarImage
																	src={
																		isMyMessage
																			? user.imageUrl
																			: selectedUser.imageUrl
																	}
																/>
																<AvatarFallback>{isMyMessage ? "Me" : selectedUser.fullName[0]}</AvatarFallback>
															</Avatar>
														)}
													</div>

													<div
														className={`rounded-2xl p-4 max-w-[70%] shadow-lg backdrop-blur-md border border-white/5
                                                            ${isMyMessage
																? "bg-brand-primary/20 text-white rounded-br-none ml-12"
																: "bg-white/5 text-zinc-100 rounded-bl-none mr-12"
															}
                                                            ${isSameSender && isMyMessage ? "rounded-tr-md" : ""}
                                                            ${isSameSender && !isMyMessage ? "rounded-tl-md" : ""}
                                                        `}
													>
														<p className='text-sm leading-relaxed'>{message.content}</p>
														<span className='text-[10px] text-white/50 mt-1 block text-right'>
															{formatTime(message.createdAt)}
														</span>
													</div>
												</motion.div>
											</div>
										);
									})}
							</ScrollArea>

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
	<div className='flex flex-col items-center justify-center h-full space-y-6 rounded-md overflow-hidden bg-gradient-to-b from-gray-300 to-gray-500'>
		{/* Melody chatting mascot */}
		<MascotImage
			state='chatting'
			size='lg'
			className='drop-shadow-xl'
		/>

		<div className='text-center '>
			<h3 className='text-zinc-900 text-lg font-medium mb-1'>Happy Chatting</h3>
			<p className='text-zinc-900 text-sm'>Select a friend to open Chat</p>
		</div>
	</div>
);
