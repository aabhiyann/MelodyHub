import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
	icon: React.ElementType;
	label: string;
	value: string | number;
	subLabel?: string;
	color?: string;
	bgColor?: string;
};

export const StatsCard = ({ icon: Icon, color, label, value, subLabel, bgColor }: StatsCardProps) => {
	return (
		<Card className='bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02]'>
			<CardContent className='p-6'>
				<div className='flex items-center gap-4'>
					<div className={`p-3 rounded-xl ${bgColor || 'bg-white/5'} group-hover:bg-white/10 transition-colors`}>
						<Icon className={`size-6 ${color || 'text-white'}`} />
					</div>
					<div>
						<p className='text-sm font-medium text-zinc-400'>{label}</p>
						<p className='text-2xl font-bold text-white mt-1'>
							{value}
							{subLabel && <span className="text-sm text-zinc-500 ml-1 font-normal">{subLabel}</span>}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
