import { SignedOut, UserButton } from "@clerk/clerk-react";

import SigninAuth from "./SigninAuth";

	import { useAuthStore } from "@/stores/AuthStore";
const Topbar = () => {
	const isAdmin  = useAuthStore();
	console.log({ isAdmin });

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-purple-900 
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-2 items-center text-white font-bold text-xl'>
				{ <img src='/melodylogo.jpg' className='size-9 rounded-4xl' /> }
				MelodyHub
			</div>
			<div className='flex items-center gap-4'>
				
				<SignedOut>
					<SigninAuth />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};
export default Topbar;
