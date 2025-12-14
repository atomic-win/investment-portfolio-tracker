'use client';
import { ChevronRight } from 'lucide-react';

import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar';
import useUpdateProfileMutation from '@/hooks/useUpdateProfileMutation';
import { Currency, Locale } from '@/types';
import { useMyProfileQuery } from '@/hooks/useMyProfileQuery';

export default function SettingsSidebarGroup() {
	const { isMobile } = useSidebar();

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
			title: 'Language',
			value: data.preferredLocale,
			options: Object.values(Locale),
		},
	];

	return (
		<SidebarGroup className='mt-auto'>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
			<SidebarMenu>
				{settings.map((setting) => (
					<Select
						key={setting.name}
						onValueChange={(x) =>
							updateSetting(
								setting.name === 'currency'
									? { preferredCurrency: x as Currency }
									: { preferredLocale: x as Locale }
							)
						}
						value={setting.value}
					>
						<SelectTrigger
							className='w-full rounded-lg sm:ml-auto'
							aria-label='Select a value'
						>
							<SelectValue>
								{setting.title} - {setting.value}
							</SelectValue>
							<SelectIcon>
								<ChevronRight className='h-4 w-4 opacity-50' />
							</SelectIcon>
						</SelectTrigger>
						<SelectContent
							className='rounded-xl'
							side={isMobile ? 'bottom' : 'right'}
							align={isMobile ? 'end' : 'start'}
						>
							{setting.options.map((option) => (
								<SelectItem
									key={option}
									value={option}
									className='rounded-lg'
								>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
