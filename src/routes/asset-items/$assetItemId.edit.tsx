import { createFileRoute } from "@tanstack/react-router";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import { Card } from "@/components/ui/card";
import EditAssetItemForm from "@/features/asset-items/components/edit-asset-item-form";
import withAssetItems from "@/features/asset-items/hoc/with-asset-items";
import type { AssetItem } from "@/types";

export const Route = createFileRoute("/asset-items/$assetItemId/edit")({
	component: EditAssetItemRoute,
});

function EditAssetItemRoute() {
	const { assetItemId } = Route.useParams();
	const WrappedComponent = withAssetItems(EditAssetItemContent);
	return <WrappedComponent assetItemId={assetItemId} />;
}

function EditAssetItemContent({
	assetItems,
	assetItemId,
}: {
	assetItems: AssetItem[];
	assetItemId: string;
}) {
	const assetItem = assetItems.find((item) => item.id === assetItemId);

	if (!assetItem) {
		return <div>Asset item not found</div>;
	}

	return (
		<>
			<title>Edit {assetItem.name}</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: "Asset Items", href: "/asset-items" },
					{ title: assetItem.name, href: `/asset-items/${assetItemId}` },
					{
						title: "Edit",
						href: `/asset-items/${assetItemId}/edit`,
						disabled: true,
					},
				]}
			/>
			<div className="container mx-auto p-2 h-full">
				<Card className="p-8 max-w-screen-sm mx-auto">
					<EditAssetItemForm assetItem={assetItem} />
				</Card>
			</div>
		</>
	);
}
