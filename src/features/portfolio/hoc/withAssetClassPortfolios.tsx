import {
	AssetClassPortfolio,
	Portfolio,
	AssetItem,
	PortfolioType,
} from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetClassPortfolios<
	T extends { portfolios: AssetClassPortfolio[] }
>(Component: React.ComponentType<T>) {
	return withValuations(
		Component,
		(assetItem: AssetItem) => assetItem.assetClass,
		calculateAssetClassPortfolio
	);
}

function calculateAssetClassPortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio
): AssetClassPortfolio {
	return {
		...portfolio,
		type: PortfolioType.PerAssetClass,
	};
}
