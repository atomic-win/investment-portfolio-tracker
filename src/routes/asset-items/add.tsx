import { createFileRoute } from "@tanstack/react-router";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import { Card } from "@/components/ui/card";
import AddAssetItemForm from "@/features/asset-items/components/add-asset-item-form";

export const Route = createFileRoute("/asset-items/add")({
	head: () => ({
		meta: [{ title: "Add Asset Item" }],
	}),
	component: AddAssetItemPage,
});

function AddAssetItemPage() {
	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: "Asset Items", href: "/asset-items" },
					{ title: "Add Asset Item", href: "/asset-items/add", disabled: true },
				]}
			/>
			<div className="container mx-auto p-2 h-full">
				<Card className="p-8 max-w-screen-sm mx-auto">
					<AddAssetItemForm />
				</Card>
			</div>
		</>
	);
}
