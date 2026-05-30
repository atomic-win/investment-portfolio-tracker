import { createFileRoute } from "@tanstack/react-router";
import AssetItemPage from "@/features/assetItems/components/AssetItemPage";

export const Route = createFileRoute("/assetitems/$assetItemId/")({
	component: AssetItemDetailPage,
});

function AssetItemDetailPage() {
	const { assetItemId } = Route.useParams();
	return <AssetItemPage assetItemId={assetItemId} />;
}
