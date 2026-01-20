import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
	icon: React.ElementType;
	label: string;
	value: string;

	iconColor: string;
};

const StatsCard = ({ icon: Icon, iconColor, label, value }: StatsCardProps) => {
	return (
		<Card className='bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02]'>
			<CardContent className='p-6'>
				<div className='flex items-center gap-4'>
					<div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
						<Icon className={`size-6 ${iconColor}`} />
					</div>
					<div>
						<p className='text-sm font-medium text-zinc-400'>{label}</p>
						<p className='text-2xl font-bold text-white mt-1'>{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
export default StatsCard;
