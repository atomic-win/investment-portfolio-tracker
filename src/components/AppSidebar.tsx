import { DollarSignIcon } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import AccountMenu from '@/components/AccountMenu';
import SettingsSidebarGroup from '@/components/SettingsSidebarGroup';
import Link from 'next/link';

const data = [
	{ title: 'Portfolio', url: '/portfolio' },
	{ title: 'Assets', url: '/assets' },
	{ title: 'Portfolio Trends', url: '/portfolio-trends' },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
									<DollarSignIcon className='size-4' />
								</div>
								<div className='flex flex-col gap-0.5 leading-none'>
									<span className='font-semibold'>
										Investment Portfolio Tracker
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton className='font-medium' asChild>
									<Link href={item.url}>{item.title}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SettingsSidebarGroup />
			</SidebarContent>
			<SidebarFooter className='mt-8'>
				<SidebarMenu>
					<SidebarMenuItem>
						<AccountMenu />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
