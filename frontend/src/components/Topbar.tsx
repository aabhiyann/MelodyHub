import { SignedOut, UserButton } from "@clerk/clerk-react";
import SigninAuth from "./SigninAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Users, Sparkles } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import { useUIStore } from "@/stores/UIStore";
import { useAIStore } from "@/stores/useAIStore";
import { cn } from "@/lib/utils";
import { StreakBadge } from "./gamification/StreakBadge";
import { GemsIndicator } from "./gamification/GemsIndicator";


const Topbar = () => {
	const { toggleActivityPanel, isActivityPanelOpen } = useUIStore();
	const { openModal } = useAIStore();


	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 z-50 glass-toolbar'
		>
			{/* Logo with Melody Icon */}
			<div className='flex gap-3 items-center'>
				{/* Mobile Menu */}
				<div className="md:hidden mr-2">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="text-text-primary">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 bg-background-base w-72 border-r border-white/10">
							<LeftSidebar />
						</SheetContent>
					</Sheet>
				</div>

				<div className='flex items-center gap-2'>
					<img
						src='/mascot/melody-icon.png'
						alt='Melody mascot'
						className='size-8 drop-shadow-lg'
					/>
					<span className='font-display font-bold text-xl tracking-tight
            bg-gradient-to-r from-brand-primary to-brand-secondary
            bg-clip-text text-transparent
          '>
						MelodyHub
					</span>
				</div>
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

				{/* AI Playlist Button (Desktop) */}
				<Button
					onClick={openModal}
					className="hidden md:flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-0 hover:opacity-90"
				>
					<Sparkles className="size-4" />
					<span className="font-semibold">AI Playlist</span>
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

				<div className='hover:scale-105 transition-transform duration-200'>
					<UserButton />
				</div>
			</div>
		</div>
	);
};

export default Topbar;

