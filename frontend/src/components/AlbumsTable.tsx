import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/MusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";

const AlbumsTable = () => {
	const { albums, deleteAlbum, fetchAlbums } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<Table>
			<TableHeader>
				<TableRow className='border-b border-white/5 hover:bg-white/5'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead className='text-zinc-400 font-medium'>Title</TableHead>
					<TableHead className='text-zinc-400 font-medium'>Artist</TableHead>
					<TableHead className='text-zinc-400 font-medium'>Release Year</TableHead>
					<TableHead className='text-zinc-400 font-medium'>Songs</TableHead>
					<TableHead className='text-right text-zinc-400 font-medium'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{albums.map((album) => (
					<TableRow key={album._id} className='hover:bg-white/5 border-b border-white/5 transition-colors group'>
						<TableCell>
							<img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover shadow-sm' />
						</TableCell>
						<TableCell className='font-medium text-white group-hover:text-brand-primary transition-colors'>{album.title}</TableCell>
						<TableCell className="text-zinc-400">{album.artist}</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Calendar className='h-4 w-4 mr-1' />
								{album.releaseYear}
							</span>
						</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								<Music className='h-4 w-4 mr-1' />
								{album.songs.length} songs
							</span>
						</TableCell>
						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => deleteAlbum(album._id)}
									className='text-zinc-400 hover:text-red-400 hover:bg-red-400/10'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default AlbumsTable;
