import { useMusicStore } from "@/stores/MusicStore";
import { ColumnDef } from "@tanstack/react-table";
import { Song } from "@/types";
import { DataTable } from "@/components/admin/DataTable";
import { BulkActions } from "@/components/admin/BulkActions";
import { Play, Trash2, Edit, Radio } from "lucide-react";
import SongDialog from "./admin/SongDialog";
import { format } from "date-fns";
import { useState } from "react";

const SongsTable = () => {
	const { songs, deleteSong } = useMusicStore();
	const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
	const [editingSong, setEditingSong] = useState<Song | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);

	// Define table columns inside component to access state and handlers
	const columns: ColumnDef<Song>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<input
					type="checkbox"
					checked={table.getIsAllPageRowsSelected()}
					onChange={table.getToggleAllPageRowsSelectedHandler()}
					className="size-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
				/>
			),
			cell: ({ row }) => (
				<input
					type="checkbox"
					checked={row.getIsSelected()}
					onChange={row.getToggleSelectedHandler()}
					className="size-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
				/>
			),
			enableSorting: false,
		},
		{
			accessorKey: "title",
			header: "Song Title",
			cell: ({ row }) => (
				<div className="flex items-center gap-3">
					<img
						src={row.original.imageUrl || "/placeholder.png"}
						alt={row.original.title}
						className="size-10 rounded object-cover"
					/>
					<div>
						<p className="font-medium">{row.original.title}</p>
						<p className="text-body-sm text-gray-500">{row.original.artist}</p>
					</div>
				</div>
			),
		},
		{
			accessorKey: "artist",
			header: "Artist",
		},
		{
			accessorKey: "albumId",
			header: "Album",
			cell: ({ row }) => {
				const { albums } = useMusicStore();
				const album = albums.find((a) => a._id === row.original.albumId);
				return <span>{album?.title || "N/A"}</span>;
			},
		},
		{
			accessorKey: "duration",
			header: "Duration",
			cell: ({ row }) => {
				const duration = row.original.duration || 0;
				const minutes = Math.floor(duration / 60);
				const seconds = Math.floor(duration % 60);
				return <span>{minutes}:{seconds.toString().padStart(2, "0")}</span>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Date Added",
			cell: ({ row }) => (
				<span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
			),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<button
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						title="Play"
						aria-label={`Play ${row.original.title}`}
					>
						<Play className="size-4 text-gray-600" />
					</button>
					<button
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						title="Edit"
						aria-label={`Edit ${row.original.title}`}
						onClick={() => {
							setEditingSong(row.original);
							setIsEditOpen(true);
						}}
					>
						<Edit className="size-4 text-gray-600" />
					</button>
					<button
						onClick={() => deleteSong(row.original._id)}
						className="p-2 hover:bg-error/10 rounded-lg transition-colors"
						title="Delete"
						aria-label={`Delete ${row.original.title}`}
					>
						<Trash2 className="size-4 text-error" />
					</button>
					<button
						onClick={() => window.location.href = `/radio/${row.original._id}`}
						className="p-2 hover:bg-violet-500/10 rounded-lg transition-colors group"
						title="Start Radio"
						aria-label={`Start radio for ${row.original.title}`}
					>
						<Radio className="size-4 text-gray-600 group-hover:text-violet-500" />
					</button>
				</div >
			),
			enableSorting: false,
		},
	];

	const handleBulkDelete = async () => {
		if (confirm(`Delete ${selectedSongs.length} songs?`)) {
			for (const song of selectedSongs) {
				await deleteSong(song._id);
			}
			setSelectedSongs([]);
		}
	};

	const handleExport = () => {
		// Export selected songs as CSV
		const csv = selectedSongs.map((song) =>
			`"${song.title}","${song.artist}","${song.duration}"`
		).join('\n');

		const blob = new Blob([`Title,Artist,Duration\n${csv}`], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'songs-export.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-4">
			<BulkActions
				selectedCount={selectedSongs.length}
				onDelete={handleBulkDelete}
				onExport={handleExport}
			/>

			<DataTable
				columns={columns}
				data={songs}
				onRowSelectionChange={setSelectedSongs}
				searchPlaceholder="Search songs..."
			/>

			<SongDialog
				mode="edit"
				songToEdit={editingSong}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
		</div>
	);
};

export default SongsTable;
