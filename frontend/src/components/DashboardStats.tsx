import { useMusicStore } from "@/stores/MusicStore";
import { Library, ListMusic, PlayCircle, Users, UserRound } from "lucide-react";
import { KPICard } from "@/components/admin/KPICard";
import { ActivityFeed, generateMockActivities } from "@/components/admin/ActivityFeed";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardStats = () => {
	const { stats } = useMusicStore();

	// Mock sparkline data (replace with real data from API)
	const mockSparkline = [45, 52, 48, 65, 70, 68, 75];

	// Prepare data for the chart
	const chartData = [
		{ name: "Songs", count: stats.totalSongs, fill: "#10b981" },
		{ name: "Albums", count: stats.totalAlbums, fill: "#8b5cf6" },
		{ name: "Artists", count: stats.totalArtists, fill: "#f97316" },
		{ name: "Users", count: stats.totalUsers, fill: "#0ea5e9" },
	];

	const activities = generateMockActivities();

	return (
		<div className="space-y-6">
			{/* KPI Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KPICard
					icon={ListMusic}
					title="Total Songs"
					value={stats.totalSongs}
					trend={{ value: 12.5, isPositive: true }}
					sparklineData={mockSparkline}
				/>
				<KPICard
					icon={Library}
					title="Total Albums"
					value={stats.totalAlbums}
					trend={{ value: 8.2, isPositive: true }}
					sparklineData={mockSparkline.map((v) => v * 0.3)}
				/>
				<KPICard
					icon={UserRound}
					title="Total Artists"
					value={stats.totalArtists}
					trend={{ value: 3.1, isPositive: false }}
					sparklineData={mockSparkline.map((v) => v * 0.5)}
				/>
				<KPICard
					icon={Users}
					title="Total Users"
					value={stats.totalUsers}
					trend={{ value: 25.3, isPositive: true }}
					sparklineData={mockSparkline.map((v) => v * 1.5)}
				/>
			</div>

			{/* Chart and Activity Feed */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Platform Overview Chart */}
				<Card className="lg:col-span-2 bg-white border-border">
					<CardHeader>
						<CardTitle className="text-heading-md font-bold text-gray-900 flex items-center gap-2">
							<PlayCircle className="text-brand-primary" size={20} />
							Platform Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis dataKey="name" stroke="#6b7280" />
									<YAxis stroke="#6b7280" />
									<Tooltip
										contentStyle={{
											backgroundColor: "white",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
											boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
										}}
										itemStyle={{ color: "#374151" }}
									/>
									<Bar dataKey="count" radius={[8, 8, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Activity Feed */}
				<ActivityFeed activities={activities} limit={8} />
			</div>
		</div>
	);
};
export default DashboardStats;
