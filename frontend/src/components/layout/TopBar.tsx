import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import SigninAuth from "@/components/shared/SigninAuth";
import { Button } from "@/components/ui/button";
import { Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useUIStore } from "@/stores/UIStore";
import { useAIStore } from "@/stores/useAIStore";
import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/features/gamification/StreakBadge";
import { GemsIndicator } from "@/components/features/gamification/GemsIndicator";
const Topbar = () => {
	const { toggleActivityPanel, isActivityPanelOpen } = useUIStore();
	const { openModal } = useAIStore();

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 z-50 glass-toolbar'
		>
			{/* Logo with Melody Icon */}
			<div className='flex gap-3 items-center'>
				{/* Mobile Menu removed in favor of BottomTabBar */}

				<Link to="/home" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
					<img
						src='/mascot/melody-icon.png'
						alt='Melody mascot'
						className='size-8 drop-shadow-lg rounded-full object-cover'
					/>
					<span className='font-display font-bold text-xl tracking-tight
            bg-gradient-to-r from-brand-primary to-brand-secondary
            bg-clip-text text-transparent
          '>
						MelodyHub
					</span>
				</Link>
			</div>

			{/* User Actions */}
			<div className='flex items-center gap-4'>
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
	);
};

export default Topbar;

