import { SignedOut, UserButton } from "@clerk/clerk-react";
import SigninAuth from "./SigninAuth";


const Topbar = () => {


	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 z-50 glass-toolbar'
		>
			{/* Logo with Melody Icon */}
			<div className='flex gap-3 items-center'>
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

