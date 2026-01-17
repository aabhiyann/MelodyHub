import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex items-center justify-between bg-purple-900'>
			<div className='flex items-center gap-3 mb-8 '>
				<Link to='/' className='rounded-lg'>
					<img src='/melodylogo.jpg' className='size-15 rounded-4xl' />
				</Link>
				<div>
					<h1 className='text-xl font-bold text-white'>Admin Dashboard</h1>

				</div>
			</div>
			
			<div className="size-12 rounded-4xl">
  <UserButton />
</div>

		</div>
	);
};
export default Header;
