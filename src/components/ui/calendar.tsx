'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDownIcon } from 'lucide-react';
import { DayPicker, DropdownProps } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			captionLayout='dropdown'
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row',
				month: 'flex flex-col gap-4 px-4',
				month_caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'hidden',
				dropdowns: 'flex justify-center gap-2',
				nav: 'mt-2',
				button_previous: cn(
					buttonVariants({ variant: 'outline' }),
					'size-8 bg-transparent p-0 opacity-50 hover:opacity-100',
					'absolute left-2'
				),
				button_next: cn(
					buttonVariants({ variant: 'outline' }),
					'size-8 bg-transparent p-0 opacity-50 hover:opacity-100',
					'absolute right-2'
				),
				month_grid: 'w-full border-collapse space-x-1',
				weekdays: 'flex',
				weekday:
					'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
				week: 'flex w-full mt-2',
				day: cn(
					'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
					props.mode === 'range'
						? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
						: '[&:has([aria-selected])]:rounded-md'
				),
				day_button: cn(
					buttonVariants({ variant: 'ghost' }),
					'size-8 p-0 font-normal aria-selected:opacity-100'
				),
				range_start:
					'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
				range_end:
					'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
				selected:
					'bg-primary text-primary-foreground hover:bg-accent hover:text-accent rounded-md',
				today: 'bg-accent text-accent-foreground rounded-md',
				outside:
					'day-outside text-muted-foreground aria-selected:text-muted-foreground',
				disabled: 'text-muted-foreground opacity-50',
				range_middle:
					'aria-selected:bg-accent aria-selected:text-accent-foreground',
				hidden: 'invisible',
				...classNames,
			}}
			components={{
				Dropdown: ({ value, onChange, ...props }: DropdownProps) => {
					const options = props.options!;
					const selected = options.find((child) => child.value === value);
					const handleChange = (value: string) => {
						const changeEvent = {
							target: { value },
						} as React.ChangeEvent<HTMLSelectElement>;
						onChange?.(changeEvent);
					};
					return (
						<Select
							value={value?.toString()}
							onValueChange={(value) => {
								handleChange(value);
							}}>
							<SelectTrigger className='pr-1.5 h-[28px]'>
								<SelectValue>{selected?.label}</SelectValue>
								<SelectIcon>
									<ChevronsUpDownIcon className='size-4' />
								</SelectIcon>
							</SelectTrigger>
							<SelectContent position='popper'>
								<ScrollArea className='h-80'>
									{options.map((option, id: number) => (
										<SelectItem
											key={`${option.value}-${id}`}
											value={option.value?.toString() ?? ''}>
											{option.label}
										</SelectItem>
									))}
								</ScrollArea>
							</SelectContent>
						</Select>
					);
				},
				PreviousMonthButton: ({ className, ...props }) => (
					<button className={className} {...props}>
						<ChevronLeft />
					</button>
				),
				NextMonthButton: ({ className, ...props }) => (
					<button className={className} {...props}>
						<ChevronRight />
					</button>
				),
			}}
			{...props}
		/>
	);
}

export { Calendar };
