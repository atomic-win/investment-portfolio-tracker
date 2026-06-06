import { GoogleOAuthProvider } from "@react-oauth/google";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<SidebarProvider>
					<AppSidebar />
					<main className="flex flex-1 flex-col gap-4 p-4 pt-0">
						<Outlet />
					</main>
				</SidebarProvider>
				<Toaster position="bottom-right" richColors />
				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "Tanstack Query",
							render: <ReactQueryDevtoolsPanel />,
						},
					]}
				/>
			</GoogleOAuthProvider>
		</QueryClientProvider>
	);
}
