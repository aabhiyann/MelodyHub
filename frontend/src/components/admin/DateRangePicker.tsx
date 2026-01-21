/**
 * DateRangePicker - Date range selector for analytics
 * Preset ranges and custom date selection
 */

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { subDays, format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface DateRange {
    from: Date;
    to: Date;
    label: string;
}

interface DateRangePickerProps {
    onRangeChange?: (range: DateRange) => void;
    className?: string;
}

const PRESET_RANGES: DateRange[] = [
    {
        from: subDays(new Date(), 7),
        to: new Date(),
        label: 'Last 7 days',
    },
    {
        from: subDays(new Date(), 30),
        to: new Date(),
        label: 'Last 30 days',
    },
    {
        from: subDays(new Date(), 90),
        to: new Date(),
        label: 'Last 90 days',
    },
];

export const DateRangePicker = ({ onRangeChange, className }: DateRangePickerProps) => {
    const [selectedRange, setSelectedRange] = useState<DateRange>(PRESET_RANGES[1]); // Default to 30 days
    const [isOpen, setIsOpen] = useState(false);

    const handleRangeSelect = (range: DateRange) => {
        setSelectedRange(range);
        onRangeChange?.(range);
        setIsOpen(false);
    };

    return (
        <div className={cn('relative inline-block', className)}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-body-md font-medium text-gray-700'
            >
                <Calendar className='size-4' />
                <span>{selectedRange.label}</span>
                <span className='text-gray-500'>
                    {format(selectedRange.from, 'MMM d')} - {format(selectedRange.to, 'MMM d, yyyy')}
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className='fixed inset-0 z-40'
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className='absolute right-0 mt-2 w-72 bg-white rounded-lg border border-gray-200 shadow-lg z-50 p-2'>
                        <div className='space-y-1'>
                            {PRESET_RANGES.map((range, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRangeSelect(range)}
                                    className={cn(
                                        'w-full text-left px-3 py-2 rounded-md transition-colors text-body-md',
                                        selectedRange.label === range.label
                                            ? 'bg-brand-primary text-white font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    )}
                                >
                                    {range.label}
                                    <div className='text-body-sm opacity-70 mt-0.5'>
                                        {format(range.from, 'MMM d')} - {format(range.to, 'MMM d, yyyy')}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Custom range placeholder */}
                        <div className='mt-2 pt-2 border-t border-gray-200'>
                            <button
                                disabled
                                className='w-full text-left px-3 py-2 rounded-md text-body-md text-gray-400 cursor-not-allowed'
                            >
                                Custom range
                                <div className='text-body-sm mt-0.5'>Coming soon</div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
