'use client';
import { DollarSignIcon } from 'lucide-react';
import Link from 'next/link';

import AccountMenu from '@/components/AccountMenu';
import SettingsSidebarGroup from '@/components/SettingsSidebarGroup';
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
import { Suspense } from 'react';
import LoadingComponent from '@/components/LoadingComponent';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const data = [
	{ title: 'Portfolio', url: '/portfolio' },
	{ title: 'Asset Items', url: '/assetitems' },
	{ title: 'Portfolio Trends', url: '/portfolio-trends' },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Link href='/'>
					<SidebarMenuButton
						size='lg'
						className={cn(
							buttonVariants(),
							'cursor-pointer',
							'size-12 w-full'
						)}
					>
						<DollarSignIcon className='size-16 bold' />
						<span className='font-semibold'>
							Investment Portfolio Tracker
						</span>
					</SidebarMenuButton>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.map((item) => (
							<SidebarMenuItem key={item.title}>
								<Link href={item.url}>
									<SidebarMenuButton className='font-medium size-10 w-full cursor-pointer'>
										{item.title}
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<Suspense
					fallback={
						<LoadingComponent loadingMessage='Loading User Profile...' />
					}
				>
					<SettingsSidebarGroup />
				</Suspense>
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
