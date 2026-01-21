import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/MusicStore";
import { ColumnDef } from "@tanstack/react-table";
import { Song } from "@/types";
import { DataTable } from "@/components/admin/DataTable";
import { BulkActions } from "@/components/admin/BulkActions";
import { Play, MoreVertical, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const SongsTable = () => {
	return (
		<div className='flex items-center justify-center py-8'>
			<div className='text-zinc-400'>Loading songs...</div>
		</div>
	);
}

if (error) {
	return (
		<div className='flex items-center justify-center py-8'>
			<div className='text-red-500'>{error}</div>
		</div>
	);
}

return (
	<Table>
		<TableHeader>
			<TableRow className='border-b border-white/5 hover:bg-white/5'>
				<TableHead className='w-[50px]'></TableHead>
				<TableHead className='text-zinc-400 font-medium'>Title</TableHead>
				<TableHead className='text-zinc-400 font-medium'>Artist</TableHead>
				<TableHead className='text-zinc-400 font-medium'>Release Date</TableHead>
				<TableHead className='text-right text-zinc-400 font-medium'>Actions</TableHead>
			</TableRow>
		</TableHeader>

		<TableBody>
			{songs.map((song) => (
				<TableRow key={song._id} className='hover:bg-white/5 border-b border-white/5 transition-colors group'>
					<TableCell>
						<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover shadow-sm' />
					</TableCell>
					<TableCell className='font-medium text-white group-hover:text-brand-primary transition-colors'>{song.title}</TableCell>
					<TableCell className="text-zinc-400">{song.artist}</TableCell>
					<TableCell>
						<span className='inline-flex items-center gap-1 text-zinc-400'>
							<Calendar className='h-4 w-4 mr-1' />
							{song.createdAt.split("T")[0]}
						</span>
					</TableCell>

					<TableCell className='text-right'>
						<div className='flex gap-2 justify-end'>
							<Button
								variant={"ghost"}
								size={"sm"}
								className='text-zinc-400 hover:text-red-400 hover:bg-red-400/10'
								onClick={() => deleteSong(song._id)}
							>
								<Trash2 className='size-4' />
							</Button>
						</div>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);
};
export default SongsTable;
