import { AssetItemPortfolio, AssetItem, Portfolio } from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetItemPortfolios<
	T extends {
		portfolios: AssetItemPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return withValuations(
		Component,
		(assetItem: AssetItem) => assetItem.id,
		calculateAssetItemPortfolio
	);
}

function calculateAssetItemPortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio
): AssetItemPortfolio {
	const assetItem = (assetItems || []).find(
		(assetItem) => assetItem.id === portfolio.id
	)!;

	return {
		...portfolio,
		name: assetItem.name,
		assetClass: assetItem.assetClass,
		assetType: assetItem.assetType,
		currency: assetItem.currency,
	};
}
