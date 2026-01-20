import { useMusicStore } from "@/stores/MusicStore";
import { Library, ListMusic, PlayCircle, Users, UserRound } from "lucide-react";
import StatsCard from "./StatsCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const DashboardStats = () => {
	const { stats } = useMusicStore();

	const statsData = [
		{
			icon: ListMusic,
			label: "Total Songs",
			value: stats.totalSongs.toString(),
			iconColor: "text-emerald-500",
		},
		{
			icon: Library,
			label: "Total Albums",
			value: stats.totalAlbums.toString(),
			iconColor: "text-violet-500",
		},
		{
			icon: UserRound,
			label: "Total Artists",
			value: stats.totalArtists.toString(),
			iconColor: "text-orange-500",
		},
		{
			icon: Users,
			label: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			iconColor: "text-sky-500",
		},
	];

	// Prepare data for the chart
	const chartData = [
		{ name: "Songs", count: stats.totalSongs, fill: "#10b981" }, // emerald-500
		{ name: "Albums", count: stats.totalAlbums, fill: "#8b5cf6" }, // violet-500
		{ name: "Artists", count: stats.totalArtists, fill: "#f97316" }, // orange-500
		{ name: "Users", count: stats.totalUsers, fill: "#0ea5e9" }, // sky-500
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{/* Stats Cards */}
			{statsData.map((stat) => (
				<StatsCard
					key={stat.label}
					icon={stat.icon}
					label={stat.label}
					value={stat.value}
					iconColor={stat.iconColor}
				/>
			))}

			{/* Chart Section - Spans full width */}
			<div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-white flex items-center gap-2">
						<PlayCircle className="text-emerald-500" size={20} />
						Platform Overview
					</h2>
				</div>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
							<XAxis dataKey="name" stroke="#9ca3af" />
							<YAxis stroke="#9ca3af" />
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(32, 32, 32, 0.8)",
									backdropFilter: "blur(4px)",
									border: "1px solid rgba(255,255,255,0.1)",
									borderRadius: "8px",
								}}
								itemStyle={{ color: "#e4e4e7" }}
							/>
							<Bar dataKey="count" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};
export default DashboardStats;
