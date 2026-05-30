import { createFileRoute } from "@tanstack/react-router";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [{ title: "Investment Portfolio Tracker" }],
	}),
	component: HomePage,
});

function HomePage() {
	return (
		<>
			<SidebarTriggerWithBreadcrumb breadcrumbs={[]} />
			<div className="text-center px-4 space-y-4">
				<h1 className="text-3xl">Investment Portfolio Tracker</h1>
			</div>
		</>
	);
}
