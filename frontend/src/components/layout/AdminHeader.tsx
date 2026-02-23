import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3'>
				<Link to='/' className='rounded-lg'>
					<img src='/melodylogo.jpg' className='size-10 rounded-full object-cover shadow-sm' />
				</Link>
				<div>
					<h1 className='text-3xl font-bold text-white tracking-tight'>Admin Dashboard</h1>
					<p className="text-zinc-400 text-sm">Manage your content</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
					<UserButton />
				</div>
			</div>
		</div>
	);
};
export default Header;
