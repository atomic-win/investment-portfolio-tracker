import {
	AssetTypePortfolio,
	Portfolio,
	AssetItem,
	PortfolioType,
} from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetTypePortfolios<
	T extends { portfolios: AssetTypePortfolio[] }
>(Component: React.ComponentType<T>) {
	return withValuations(
		Component,
		(assetItem: AssetItem) => assetItem.assetType,
		calculateAssetTypePortfolio
	);
}

function calculateAssetTypePortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio
): AssetTypePortfolio {
	return {
		...portfolio,
		type: PortfolioType.PerAssetType,
	};
}
