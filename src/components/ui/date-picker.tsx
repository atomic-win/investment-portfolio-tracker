'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DatePicker({
	date,
	onSelect,
}: {
	date: Date | undefined;
	onSelect?: (date: Date | undefined) => void | undefined;
}) {
	return (
		<Popover>
			<PopoverTrigger
				disabled={!onSelect}
				className={cn(
					!date && 'text-muted-foreground',
					buttonVariants({ variant: 'outline' }),
					'w-full justify-start font-normal items-center'
				)}
			>
				<CalendarIcon />
				{date ? format(date, 'PPP') : <span>Pick a date</span>}
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={onSelect}
					autoFocus
					fixedWeeks
					className='rounded-md border shadow-sm'
					captionLayout='dropdown'
				/>
			</PopoverContent>
		</Popover>
	);
}
