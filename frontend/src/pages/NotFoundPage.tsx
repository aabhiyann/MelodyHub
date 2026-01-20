import { Home, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MascotImage } from "@/components/MascotImage";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<div className='h-screen bg-neutral-900 flex items-center justify-center'>
			<div className='text-center space-y-8 px-4'>
				{/* Melody mascot - error state */}
				<div className='flex justify-center'>
					<MascotImage
						state='error'
						size='xl'
						className='drop-shadow-2xl'
					/>
				</div>

				{/* Error message */}
				<div className='space-y-4'>
					<h1 className='text-7xl font-bold text-white'>404</h1>
					<h2 className='text-2xl font-semibold text-white'>Lost in the Music?</h2>
					<p className='text-neutral-400 max-w-md mx-auto'>
						Looks like this page wandered off to find the perfect playlist. Let's get you back on track! <Music className="inline-block w-5 h-5 ml-1 text-emerald-500 animate-bounce" />
					</p>
				</div>

				{/* Action buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
					<Button
						onClick={() => navigate(-1)}
						variant='outline'
						className='bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto'
					>
						Go Back
					</Button>
					<Button
						onClick={() => navigate("/")}
						className='bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto'
					>
						<Home className='mr-2 h-4 w-4' />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
}
