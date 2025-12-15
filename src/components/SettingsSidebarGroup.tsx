'use client';
import { ChevronRight } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from '@/components/ui/sidebar';
import useUpdateProfileMutation from '@/hooks/useUpdateProfileMutation';
import { Currency, Locale } from '@/types';
import { useMyProfileQuery } from '@/hooks/useMyProfileQuery';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function SettingsSidebarGroup() {
	const { data, isFetching, error } = useMyProfileQuery();
	const { mutate: updateSetting } = useUpdateProfileMutation();

	if (
		isFetching ||
		error ||
		!data ||
		!data.preferredLocale ||
		!data.preferredCurrency
	) {
		return <SidebarGroup className='mt-auto' />;
	}

	const settings = [
		{
			name: 'currency',
			title: 'Currency',
			value: data.preferredCurrency,
			options: Object.values(Currency).filter(
				(x) => x !== Currency.Unknown
			),
		},
		{
			name: 'locale',
			title: 'Locale',
			value: data.preferredLocale,
			options: Object.values(Locale),
		},
	];

	return (
		<SidebarGroup className='mt-auto'>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
			<SidebarMenu>
				{settings.map((setting) => (
					<DropdownMenu key={setting.name}>
						<DropdownMenuTrigger
							className={cn(
								'w-full rounded-lg px-3 py-2 flex justify-between',
								buttonVariants({
									variant: 'outline',
								})
							)}
							aria-label='Select a value'
						>
							<span>
								{setting.title} - {setting.value}
							</span>
							<ChevronRight className='h-4 w-4 opacity-50' />
						</DropdownMenuTrigger>
						<DropdownMenuContent side='right'>
							{setting.options.map((option) => (
								<DropdownMenuCheckboxItem
									key={option}
									checked={option === setting.value}
									onCheckedChange={() =>
										updateSetting(
											setting.name === 'currency'
												? {
														preferredCurrency:
															option as Currency,
												  }
												: {
														preferredLocale:
															option as Locale,
												  }
										)
									}
								>
									{option}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
