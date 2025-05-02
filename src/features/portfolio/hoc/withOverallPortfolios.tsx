import { OverallPortfolio, Portfolio, AssetItem, PortfolioType } from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withOverallPortfolios<
	T extends { portfolios: OverallPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithOverallPortfolios(
		props: Omit<T, 'portfolios'> & {
			assetItems: AssetItem[];
			assetItemIds: string[];
			latest: boolean;
			currency: string;
		}
	) {
		const WithLoadedValuationsComponent = withValuations(Component);

		return (
			<WithLoadedValuationsComponent
				{...(props as unknown as T)}
				assetItems={props.assetItems}
				assetItemIds={props.assetItemIds}
				latest={props.latest}
				currency={props.currency}
				idSelector={() => 'overall'}
				portfolioFn={calculateOverallPortfolio}
			/>
		);
	};
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
