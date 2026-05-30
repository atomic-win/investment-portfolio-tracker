import { withValuations } from "@/features/portfolio/hoc/with-valuations";
import type { AssetItem, AssetItemPortfolio, Portfolio } from "@/types";

export function withAssetItemPortfolios<
	T extends {
		portfolios: AssetItemPortfolio[];
	},
>(Component: React.ComponentType<T>) {
	return withValuations(
		Component,
		(assetItem: AssetItem) => assetItem.id,
		calculateAssetItemPortfolio,
	);
}

function calculateAssetItemPortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio,
): AssetItemPortfolio {
	// biome-ignore lint/style/noNonNullAssertion: we assume that all portfolio ids are valid and exist in assetItems
	const assetItem = (assetItems || []).find(
		(assetItem) => assetItem.id === portfolio.id,
	)!;

	return {
		...portfolio,
		name: assetItem.name,
		assetClass: assetItem.assetClass,
		assetType: assetItem.assetType,
		currency: assetItem.currency,
	};
}
