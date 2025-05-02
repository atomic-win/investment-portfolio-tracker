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
	return function WithAssetClassPortfolios(
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
				idSelector={(assetItem) => assetItem.assetClass}
				portfolioFn={calculateAssetClassPortfolio}
			/>
		);
	};
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
