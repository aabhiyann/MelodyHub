import { useMusicStore } from "@/stores/MusicStore";
import { Library, ListMusic , Users , UserRound  } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
	const { stats } = useMusicStore();

	const statsData = [
		{
			icon: ListMusic ,
			label: "Total Songs",
			value: stats.totalSongs.toString(),
			iconColor: "text-emerald-900 "
		},
		{
			icon: Library,
			label: "Total Albums",
			value: stats.totalAlbums.toString(),
			iconColor: "text-purple-900",
		},
		{
			icon: UserRound ,
			label: "Total Artists",
			value: stats.totalArtists.toString(),
	
			iconColor: "text-amber-900",
		},
		{
			icon: Users ,
			label: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			
			iconColor: "text-amber-900",
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-6 border  '>
			{statsData.map((stat) => (
				<StatsCard 
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					value={stat.value}
					
					iconColor={stat.iconColor}
				/>
			))}
		</div>
	);
};
export default DashboardStats;
