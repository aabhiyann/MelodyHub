import { SignedOut, UserButton } from "@clerk/clerk-react";
import SigninAuth from "./SigninAuth";
import { useAuthStore } from "@/stores/AuthStore";

const Topbar = () => {
	const isAdmin = useAuthStore();
	console.log({ isAdmin });

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 z-10
        glass border-b border-[var(--color-border-primary)]
        backdrop-blur-xl bg-[var(--color-bg-primary)]/80
      '
		>
			{/* Logo with Melody Icon */}
			<div className='flex gap-3 items-center'>
				<div className='flex items-center gap-2'>
					<img
						src='/mascot/melody-icon.png'
						alt='Melody mascot'
						className='size-8 drop-shadow-lg'
					/>
					<span className='text-white font-display font-bold text-xl tracking-tight
            bg-gradient-to-r from-[var(--melody-purple-400)] to-[var(--melody-blue-400)]
            bg-clip-text text-transparent
          '>
						MelodyHub
					</span>
				</div>
			</div>

			{/* User Actions */}
			<div className='flex items-center gap-4'>
				<SignedOut>
					<SigninAuth />
				</SignedOut>

				<div className='hover:scale-105 transition-transform duration-200'>
					<UserButton />
				</div>
			</div>
		</div>
	);
};

export default Topbar;

