import { OverallPortfolio, Portfolio, AssetItem, PortfolioType } from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withOverallPortfolios<
	T extends { portfolios: OverallPortfolio[] }
>(Component: React.ComponentType<T>) {
	return withValuations(Component, () => 'overall', calculateOverallPortfolio);
}

function calculateOverallPortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio
): OverallPortfolio {
	return {
		...portfolio,
		type: PortfolioType.Overall,
	};
}
