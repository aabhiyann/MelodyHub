import Topbar from "@/components/layout/TopBar";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useChatStore } from "@/stores/ChatStore";
import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageInput } from "@/components/features/chat/MessageInput";
import { FriendsList } from "@/components/features/social/FriendsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import { MascotImage } from "@/components/shared/MascotImage";
import { motion } from "framer-motion";
import { SectionErrorBoundary } from "@/components/shared/SectionErrorBoundary";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";


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
	const location = useLocation();
	const {
		selectedUser,
		messages,
		friends,
		fetchUsers,
		fetchMessages,
		fetchFriends,
		setSelectedUser,
		typingUsers,
	} = useChatStore();

	const scrollRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const prevMessageCountRef = useRef(0);
	const [showNewMessagesChip, setShowNewMessagesChip] = useState(false);

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	// Deep link: open conversation with user when navigating from profile "Message" button
	const openUserIdRef = useRef<string | null>(null);
	useEffect(() => {
		const openUserId = (location.state as { openUserId?: string } | null)?.openUserId;
		if (openUserId) {
			openUserIdRef.current = openUserId;
			window.history.replaceState({}, document.title, location.pathname);
			fetchFriends();
		}
	}, [location.state, fetchFriends]);

	useEffect(() => {
		const openUserId = openUserIdRef.current;
		if (!openUserId) return;
		const found = friends.find(
			(f) => f.clerkId === openUserId || (f as { _id?: string })._id === openUserId
		);
		if (found) {
			setSelectedUser(found);
			openUserIdRef.current = null;
		}
	}, [friends, setSelectedUser]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	const checkNearBottom = useCallback(() => {
		const el = scrollContainerRef.current;
		if (!el) return;
		const threshold = 80;
		const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
		if (atBottom) setShowNewMessagesChip(false);
	}, []);

	// Auto-scroll: scroll to bottom when user sends; when receiving, only scroll if already near bottom
	useEffect(() => {
		const prevLen = prevMessageCountRef.current;
		prevMessageCountRef.current = messages.length;
		const lastMsg = messages[messages.length - 1];
		const lastIsFromMe = lastMsg?.senderId === user?.id;
		if (messages.length === 0) return;
		if (lastIsFromMe || prevLen === 0) {
			scrollRef.current?.scrollIntoView({ behavior: "smooth" });
			setShowNewMessagesChip(false);
			return;
		}
		if (messages.length <= prevLen) return;
		// New incoming message: after layout, check if we were near bottom
		requestAnimationFrame(() => {
			const el = scrollContainerRef.current;
			if (!el) return;
			const threshold = 80;
			const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
			if (atBottom) {
				scrollRef.current?.scrollIntoView({ behavior: "smooth" });
				setShowNewMessagesChip(false);
			} else {
				setShowNewMessagesChip(true);
			}
		});
	}, [messages, user?.id]);

	const scrollToBottom = () => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
		setShowNewMessagesChip(false);
	};

	// DESIGN_PLAN: iMessage-style bubbles — self: accent gradient; other: bg_elevated + border_subtle
	const getBubbleClasses = (isMe: boolean, isFirst: boolean, isLast: boolean, isTemp: boolean) => {
		return cn(
			"px-3.5 py-2 text-[15px] leading-relaxed transition-all duration-200 tracking-tight",
			// Color: self = accent_primary → accent_primary_soft, text_invert; other = bg_elevated, border_subtle, text_primary
			isMe
				? "text-[#020617] bg-gradient-to-br from-[#22C55E] to-[#16A34A]"
				: "bg-[#101019] text-[#F9FAFB] border border-[#1F2933]",
			// Radius: pill 18–24px self, 16–20px other; clustering (iMessage-style)
			isMe ? "rounded-[22px]" : "rounded-[18px]",
			isMe && !isFirst && "rounded-tr-[4px]",
			isMe && !isLast && "rounded-br-[4px]",
			isMe && isLast && "rounded-br-none",
			!isMe && !isFirst && "rounded-tl-[4px]",
			!isMe && !isLast && "rounded-bl-[4px]",
			!isMe && isLast && "rounded-bl-none",
			isTemp && "opacity-60"
		);
	};

	return (
		<div className='h-full flex flex-col rounded-lg overflow-hidden bg-transparent'>
			<Topbar />

			<div className='flex md:grid md:grid-cols-[300px_1fr] flex-1 min-h-0 rounded-xl overflow-hidden bg-background-elevated/40 backdrop-blur-lg border border-white/5 relative'>
				<div
					className={cn(
						"w-full md:w-auto h-full flex-shrink-0 md:flex transition-all duration-300",
						selectedUser ? "hidden" : "flex"
					)}
				>
					<SectionErrorBoundary sectionName="Friends List">
						<FriendsList />
					</SectionErrorBoundary>
				</div>

				<div
					className={cn(
						"flex flex-col h-full bg-white/[0.02] backdrop-blur-md relative min-h-0 overflow-hidden w-full transition-all duration-300",
						!selectedUser ? "hidden md:flex" : "flex"
					)}
				>
					{selectedUser ? (
						<SectionErrorBoundary sectionName="Conversation">
						<>
							<ChatHeader />

							{/* Messages */}
							<div
								ref={scrollContainerRef}
								onScroll={checkNearBottom}
								className='flex-1 w-full min-h-0 overflow-y-auto overflow-x-hidden touch-scroll'
							>
								<div className='p-4 space-y-4 min-h-0 pb-12 relative'>
									{showNewMessagesChip && (
										<button
											type="button"
											onClick={scrollToBottom}
											className="sticky top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full text-xs font-medium bg-[#101019] border border-[#1F2933] text-[#F9FAFB] shadow-lg hover:bg-[#1F2933] transition-colors"
										>
											New messages
										</button>
									)}
									{messages.map((message: Message, index) => {
										const isMyMessage = message.senderId === user?.id;
										const previousMessage = messages[index - 1];
										const nextMessage = messages[index + 1];

										const isSameSenderAsPrev = previousMessage?.senderId === message.senderId;
										const isSameSenderAsNext = nextMessage?.senderId === message.senderId;

										const timeThreshold = 5 * 60 * 1000; // 5 minutes

										const isFirstInSequence = !isSameSenderAsPrev || (new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() > timeThreshold);
										const isLastInSequence = !isSameSenderAsNext || (new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime() > timeThreshold);
										const isSequential = !isFirstInSequence;

										const showDate = !previousMessage ||
											new Date(message.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString();

										const isTemp = message._id.startsWith("temp-");

										return (
											<div key={message._id}>
												{showDate && (
													<div className="flex justify-center my-6">
														<span className="text-[12px] text-[#6B7280] font-normal tracking-wide">
															{formatDate(message.createdAt)}
														</span>
													</div>
												)}

												<motion.div
													layout
													initial={{ opacity: 0, scale: 0.95, y: 10 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													transition={{ type: "spring", stiffness: 400, damping: 25 }}
													className={`flex items-end gap-2 ${isSequential ? "mt-1" : "mt-4"} ${isMyMessage ? "justify-end" : "justify-start"}`}
												>
													<div className={`size-7 flex-shrink-0 ${isMyMessage ? 'order-2' : 'order-1'}`}>
														{!isMyMessage && isLastInSequence && (
															<Avatar className='size-7 border border-white/10 shadow-sm ring-1 ring-white/5'>
																<AvatarImage src={selectedUser.imageUrl} className="object-cover" />
																<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
															</Avatar>
														)}
													</div>

													<div className={`relative max-w-[70%] group ${isMyMessage ? 'order-1' : 'order-2'}`}>
														<div className={getBubbleClasses(isMyMessage, isFirstInSequence, isLastInSequence, isTemp)}>
															<p>{message.content}</p>
														</div>
														{/* Timestamp: caption style, reveal on hover/tap (DESIGN_PLAN) */}
														<span className={`text-[12px] text-[#6B7280] absolute bottom-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none pointer-events-none w-max ${isMyMessage ? "right-full mr-2" : "left-full ml-2"}`}>
															{formatTime(message.createdAt)} {isTemp && "• Sending"}
														</span>
													</div>
												</motion.div>
											</div>
										);
									})}

									{/* Anchor for auto-scroll */}
									<div ref={scrollRef} className="h-1" />
								</div>
							</div>

							{/* Typing Indicator & Input Area Container */}
							<div className="relative w-full z-10">
								{/* Typing indicator: DESIGN_PLAN — other-bubble style, text_muted, animated dots */}
								<div className="absolute bottom-full left-6 mb-2 pointer-events-none">
									{selectedUser && typingUsers?.has(selectedUser.clerkId) && (
										<div className="flex items-center gap-2 bg-[#101019] border border-[#1F2933] px-4 py-2.5 rounded-[18px] w-fit animate-in slide-in-from-bottom-2 fade-in duration-300">
											<span className="flex gap-1" aria-hidden>
												<span className="w-2 h-2 rounded-full bg-[#6B7280] animate-typing-dot" />
												<span className="w-2 h-2 rounded-full bg-[#6B7280] animate-typing-dot [animation-delay:0.2s]" />
												<span className="w-2 h-2 rounded-full bg-[#6B7280] animate-typing-dot [animation-delay:0.4s]" />
											</span>
											<span className="text-xs text-[#6B7280] font-medium">{selectedUser.fullName} is typing...</span>
										</div>
									)}
								</div>

								<MessageInput />
							</div>
						</>
						</SectionErrorBoundary>
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
