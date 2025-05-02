'use client';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar';
import useUpdateSettingsMutation from '@/hooks/useUpdateSettingsMutation';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';
import { useMySettingsQuery } from '@/hooks/useMySettingsQuery';
import { Currency, Language } from '@/types';

export default function SettingsSidebarGroup() {
	const { isMobile } = useSidebar();

	const { data, isFetching, error } = useMySettingsQuery();
	const { mutate: updateSetting } = useUpdateSettingsMutation();

	if (isFetching || error || !data || !data.language || !data.currency) {
		return <SidebarGroup className='mt-auto' />;
	}

	const settings = [
		{
			name: 'currency',
			title: 'Currency',
			value: data.currency,
			options: Object.values(Currency).filter((x) => x !== Currency.Unknown),
		},
		{
			name: 'locale',
			title: 'Language',
			value: data.language,
			options: Object.values(Language),
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
									? { currency: x as Currency }
									: { language: x as Language }
							)
						}
						value={setting.value}>
						<SelectTrigger
							className='w-full rounded-lg sm:ml-auto'
							aria-label='Select a value'>
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
							align={isMobile ? 'end' : 'start'}>
							{setting.options.map((option) => (
								<SelectItem key={option} value={option} className='rounded-lg'>
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
