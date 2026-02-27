import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import SigninAuth from "@/components/shared/SigninAuth";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, Menu, ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { useUIStore } from "@/stores/UIStore";
import { useAIStore } from "@/stores/useAIStore";
import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/features/gamification/StreakBadge";
import { GemsIndicator } from "@/components/features/gamification/GemsIndicator";
const Topbar = () => {
	const { toggleActivityPanel, isActivityPanelOpen } = useUIStore();
	const { openModal } = useAIStore();
	const location = useLocation();
	const navigate = useNavigate();

	// Root routes (no back button): the 4 bottom-nav destinations + landing
	const isRootRoute =
		['/home', '/browse', '/chat', '/profile'].includes(location.pathname) ||
		location.pathname === '/';

	return (
		<div className='flex flex-col sticky top-0 z-50 w-full border-b border-white/[0.08]' style={{ background: 'rgba(16,16,22,0.94)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
			<div className='flex items-center justify-between px-4 md:px-5 py-3 w-full'>
				{/* Logo: consistent with sidebar (top-left; back or menu on mobile) */}
				<div className='flex gap-2 md:gap-3 items-center min-w-0'>
					<div className="md:hidden flex items-center shrink-0">
						{!isRootRoute ? (
							<Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-[#9CA3AF] hover:text-[#F9FAFB] -ml-1" aria-label="Back">
								<ChevronLeft className="size-7" />
							</Button>
						) : (
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="text-[#9CA3AF] hover:text-[#F9FAFB]" aria-label="Menu">
										<Menu className="size-6" />
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="p-0 w-[280px] border-r border-white/[0.08] z-[100]" style={{ background: 'rgba(16,16,22,0.98)', backdropFilter: 'blur(24px)' }}>
									<SheetHeader className="p-4 border-b border-white/[0.08] text-left">
										<SheetTitle className="flex items-center gap-2">
											<img src='/mascot/melody-icon.png' alt='' className='size-8 rounded-full object-cover' />
											<span className="font-display font-bold text-lg text-[#F9FAFB]">MelodyHub</span>
										</SheetTitle>
									</SheetHeader>
									<div className="p-2 h-[calc(100vh-65px)] overflow-y-auto pb-20">
										<LeftSidebar />
									</div>
								</SheetContent>
							</Sheet>
						)}
					</div>

					<Link to="/home" className='hidden md:flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0'>
						<img src='/mascot/melody-icon.png' alt='MelodyHub' className='size-8 rounded-full object-cover' />
						<span className='font-display font-bold text-lg tracking-tight text-[#F9FAFB]'>MelodyHub</span>
					</Link>
				</div>

				{/* User Actions */}
				<div className='flex items-center gap-2 md:gap-3'>
					<div className="hidden md:flex items-center gap-2 mr-2">
						<StreakBadge />
						<GemsIndicator />
					</div>

					<SignedOut>
						<SigninAuth />
					</SignedOut>

					{/* Magic Button (Desktop) */}
					<Button
						onClick={openModal}
						className="hidden md:flex items-center gap-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 hover:border-brand-primary/30 transition-all duration-300"
					>
						<Sparkles className="size-4 animate-pulse group-hover:scale-110 transition-transform" />
						<span className="font-semibold text-sm">Magic</span>
					</Button>

					{/* Activity Feed Toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="text-text-secondary hover:text-text-primary hidden lg:flex"
						onClick={toggleActivityPanel}
						title={isActivityPanelOpen ? "Hide Friend Activity" : "Show Friend Activity"}
					>
						<Users className={cn("size-5 transition-colors", isActivityPanelOpen && "text-brand-primary")} />
					</Button>

					<SignedIn>
						<NotificationBell />
					</SignedIn>

					<div className='hover:scale-105 transition-transform duration-200'>
						<UserButton />
					</div>
				</div>
			</div>

			{/* Mobile Quick Filters (Home Only) */}
			{location.pathname === '/home' && (
				<div className="px-4 pb-3 md:hidden">
					<div className="flex overflow-x-auto no-scrollbar space-x-3">
						<Button className="rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 font-semibold text-sm transition-transform active:scale-95 shadow-lg shadow-brand-primary/20 shrink-0 h-9 px-5">All</Button>
						<Button variant="outline" className="rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border-white/5 shrink-0 h-9 px-5">Music</Button>
						<Button variant="outline" className="rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border-white/5 shrink-0 h-9 px-5 gap-2" onClick={(e) => { e.preventDefault(); navigate('/library?tab=podcasts'); }}>Podcasts</Button>
						<Button variant="outline" className="rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border-white/5 shrink-0 h-9 px-5" onClick={(e) => { e.preventDefault(); document.querySelector('.cl-userButtonTrigger')?.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }}>Profile</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Topbar;

