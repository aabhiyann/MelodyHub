import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ListMusic } from "lucide-react";
import { SongsTable } from "./SongsTable";
import { SongDialog } from "./SongDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
					<SongDialog trigger={
						<Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">
							<Plus className="mr-2 h-4 w-4" />
							Add Songs
						</Button>
					} />
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;
