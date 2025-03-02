import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
	icon: React.ElementType;
	label: string;
	value: string;
	
	iconColor: string;
};

const StatsCard = ({ icon: Icon, iconColor, label, value }: StatsCardProps) => {
	return (
		<Card className='bg-zinc-400 border-purple-950 hover:bg-zinc-800/50 transition-colors rounded-full'>
			<CardContent className='p-6'>
				<div className='flex items-center gap-4'>
					<div className={` rounded-lg `}>
						<Icon className={`size-6 ${iconColor}`} />
					</div>
					<div>
						<p className='text-sm text-purple-950'>{label}</p>
						<p className='text-3xl font-bold'>{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
export default StatsCard;
