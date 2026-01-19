import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIStore } from "@/stores/AIStore";
import { usePlayerStore } from "@/stores/PlayerStore";
import { Bot, Loader2, Play } from "lucide-react";
import { useState } from "react";

const AIPlaylistDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [prompt, setPrompt] = useState("");
	const { generatePlaylist, generatedPlaylist, isLoading } = useAIStore();
	const { playAlbum } = usePlayerStore();

	const handleGenerate = async () => {
		if (!prompt.trim()) return;
		await generatePlaylist(prompt);
		setPrompt("");
	};

	const handlePlay = () => {
		if (generatedPlaylist.length === 0) return;
		playAlbum(generatedPlaylist, 0);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='secondary' className='w-full justify-start gap-2 text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-800/50'>
					<Bot className='size-4' />
					AI Playlist
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-900 border-zinc-800 max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Bot className='size-5 text-emerald-500' />
						AI Playlist Generator
					</DialogTitle>
					<DialogDescription>
						Describe your mood or activity, and we'll create a playlist for you.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-4'>
					<div className='flex gap-2'>
						<Input
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder='e.g., "Upbeat workout music for Monday morning"'
							className='bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500'
							onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
						/>
						<Button
							onClick={handleGenerate}
							disabled={isLoading || !prompt.trim()}
							className='bg-emerald-500 hover:bg-emerald-600 text-white'
						>
							{isLoading ? <Loader2 className='size-4 animate-spin' /> : "Generate"}
						</Button>
					</div>

					{/* Results */}
					{generatedPlaylist.length > 0 && (
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<h3 className='text-sm font-medium text-zinc-400'>
									Generated Songs ({generatedPlaylist.length})
								</h3>
								<Button size='sm' onClick={handlePlay} className='gap-2'>
									<Play className='size-3' />
									Play All
								</Button>
							</div>

							<ScrollArea className='h-[200px] w-full rounded-md border border-zinc-800 bg-zinc-900/50 p-4'>
								<div className='space-y-2'>
									{generatedPlaylist.map((song) => (
										<div
											key={song._id}
											className='flex items-center gap-3 p-2 rounded hover:bg-zinc-800/50 group'
										>
											<img
												src={song.imageUrl}
												alt={song.title}
												className='size-8 rounded object-cover'
											/>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-white truncate'>
													{song.title}
												</p>
												<p className='text-xs text-zinc-500 truncate'>
													{song.artist}
												</p>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default AIPlaylistDialog;
