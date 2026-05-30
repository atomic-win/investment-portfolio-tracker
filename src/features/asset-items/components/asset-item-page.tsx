import withCurrency from "@/components/hoc/with-currency";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import AssetItem from "@/features/asset-items/components/asset-item";
import withAssetItems from "@/features/asset-items/hoc/with-asset-items";
import { withAssetItemPortfolios } from "@/features/portfolio/hoc/with-asset-item-portfolios";
import type { AssetItemPortfolio } from "@/types";

export default function AssetItemPage({
	assetItemId,
}: {
	assetItemId: string;
}) {
	const WithLoadedAssetItemWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(AssetItemWrapper)),
	);

	return (
		<WithLoadedAssetItemWrapper assetItemIds={[assetItemId]} latest={true} />
	);
}

function AssetItemWrapper({
	portfolios,
}: {
	portfolios: AssetItemPortfolio[];
}) {
	const assetItem = portfolios[0];

	return (
		<>
			<title>{assetItem.name}</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: "Asset Items", href: "/asset-items" },
					{ title: assetItem.name, href: `/asset-items/${assetItem.id}` },
				]}
			/>
			<div className="container mx-auto p-2">
				<AssetItem assetItem={assetItem} />
			</div>
		</>
	);
}
