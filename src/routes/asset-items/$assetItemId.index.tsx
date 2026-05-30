import { createFileRoute } from "@tanstack/react-router";
import AssetItemPage from "@/features/asset-items/components/asset-item-page";

export const Route = createFileRoute("/asset-items/$assetItemId/")({
	component: AssetItemDetailPage,
});

function AssetItemDetailPage() {
	const { assetItemId } = Route.useParams();
	return <AssetItemPage assetItemId={assetItemId} />;
}
