const PlaylistTab = () => {
	return Array.from({ length: 7 }).map((_, i) => (
		<div key={i} className='bg-purple-950 rounded-lg flex flex-col p-4'>
			<div className='w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0 animate-pulse' />
			<div className='flex-1 min-w-0 hidden md:block space-y-2'>
				<div className='h-4 bg-zinc-800 rounded animate-pulse w-3/4' />
				<div className='h-3 bg-zinc-800 rounded animate-pulse w-1/2' />
			</div>
		</div>
	));
};
export default PlaylistTab;
