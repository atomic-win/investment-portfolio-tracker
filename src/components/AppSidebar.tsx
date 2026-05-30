import { Link, useLocation } from "@tanstack/react-router";
import { DollarSignIcon } from "lucide-react";
import { Suspense } from "react";
import AccountMenu from "@/components/AccountMenu";
import LoadingComponent from "@/components/LoadingComponent";
import SettingsSidebarGroup from "@/components/SettingsSidebarGroup";
import { buttonVariants } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const data = [
	{ title: "Portfolio", url: "/portfolio" },
	{ title: "Asset Items", url: "/assetitems" },
	{ title: "Portfolio Trends", url: "/portfolio-trends" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Link to="/">
					<SidebarMenuButton
						size="lg"
						className={cn(buttonVariants(), "cursor-pointer", "size-12 w-full")}
					>
						<DollarSignIcon className="size-16 bold" />
						<span className="font-semibold">Investment Portfolio Tracker</span>
					</SidebarMenuButton>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.map((item) => (
							<SidebarMenuItem key={item.title}>
								<Link to={item.url}>
									<SidebarMenuButton
										className={cn(
											"font-medium size-10 w-full cursor-pointer",
											(pathname === item.url ||
												pathname.startsWith(`${item.url}/`)) &&
												"bg-primary text-primary-foreground",
										)}
									>
										{item.title}
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<Suspense
					fallback={<LoadingComponent loadingMessage="Loading User..." />}
				>
					<SettingsSidebarGroup />
				</Suspense>
			</SidebarContent>
			<SidebarFooter className="mt-8">
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
