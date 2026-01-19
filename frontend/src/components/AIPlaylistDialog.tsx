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
import { Bot, Loader2, Play, Sparkles } from "lucide-react";
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
				<Button 
					variant='outline' 
					className='w-full justify-start gap-2 text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-800/50 hover:border-emerald-500/50 transition-all duration-300 group'
				>
					<Sparkles className='size-4 group-hover:text-emerald-400 transition-colors' />
					AI Playlist
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-zinc-950 border-zinc-800 max-w-md shadow-2xl shadow-emerald-500/10'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2 text-xl font-bold'>
						<div className="p-2 bg-emerald-500/10 rounded-lg">
							<Sparkles className='size-5 text-emerald-500' />
						</div>
						AI DJ
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Tell me your mood, activity, or genre, and I'll curate the perfect vibe.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-4'>
					<div className='space-y-2'>
						<label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Your Prompt</label>
						<div className='flex gap-2'>
							<Input
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder='e.g., "Late night coding session lofi"'
								className='bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 h-11'
								onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
							/>
							<Button
								onClick={handleGenerate}
								disabled={isLoading || !prompt.trim()}
								className='bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 font-medium'
							>
								{isLoading ? (
									<Loader2 className='size-4 animate-spin' />
								) : (
									"Generate"
								)}
							</Button>
						</div>
					</div>

					{/* Results */}
					{generatedPlaylist.length > 0 && (
						<div className='space-y-3 animate-in fade-in slide-in-from-top-2 duration-300'>
							<div className='flex items-center justify-between border-b border-zinc-800 pb-2'>
								<h3 className='text-sm font-medium text-emerald-400'>
									Curated Selection ({generatedPlaylist.length})
								</h3>
								<Button size='sm' variant="ghost" onClick={handlePlay} className='gap-2 text-white hover:text-emerald-400 hover:bg-zinc-800/50'>
									<Play className='size-3 fill-current' />
									Play All
								</Button>
							</div>

							<ScrollArea className='h-[240px] w-full rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-2'>
								<div className='space-y-1'>
									{generatedPlaylist.map((song) => (
										<div
											key={song._id}
											className='flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 group transition-colors cursor-default'
										>
											<div className="relative size-10 rounded-md overflow-hidden">
												<img
													src={song.imageUrl}
													alt={song.title}
													className='size-full object-cover'
												/>
												<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
													<Play className="size-4 text-white fill-current" />
												</div>
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors'>
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
