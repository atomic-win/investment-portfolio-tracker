import {
	AssetClassPortfolio,
	Portfolio,
	AssetItem,
	PortfolioType,
	Transaction,
} from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetClassPortfolios<
	T extends { portfolios: AssetClassPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithAssetClassPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: string;
			assetItemIds: string[];
			assetItems: AssetItem[];
			transactions: Transaction[];
			latest: boolean;
		}
	) {
		const WithLoadedValuationsComponent = withValuations(Component);

		return (
			<WithLoadedValuationsComponent
				{...(props as unknown as T)}
				currency={props.currency}
				assetItemIds={props.assetItemIds}
				assetItems={props.assetItems}
				transactions={props.transactions}
				idSelector={(assetItem) => assetItem.assetClass}
				portfolioFn={calculateAssetClassPortfolio}
				latest={props.latest}
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
