import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListMusic  } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";

const SongsTabContent = () => {
	return (
		<div className="bg-zinc-400" >
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between '>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<ListMusic  className='size-7 text-emerald-900' />
							Songs Library
						</CardTitle>
						<CardDescription>Manage your music tracks</CardDescription>
					</div>
					<AddSongDialog />
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable />
			</CardContent>
		</Card>
		</div>
	);
};
export default SongsTabContent;
