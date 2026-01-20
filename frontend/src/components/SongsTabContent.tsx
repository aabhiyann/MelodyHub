import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListMusic } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";

const SongsTabContent = () => {
	return (
		<Card className="bg-white/5 backdrop-blur-sm border-white/5">
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2 text-white'>
							<ListMusic className='size-5 text-brand-primary' />
							Songs Library
						</CardTitle>
						<CardDescription className="text-zinc-400">Manage your music tracks</CardDescription>
					</div>
					<AddSongDialog />
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;
