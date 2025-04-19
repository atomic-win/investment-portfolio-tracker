import {
	AssetClassPortfolio,
	Portfolio,
	AssetItem,
	PortfolioType,
	Transaction,
} from '@/features/lib/types';
import { withValuations } from '@/features/components/hoc/withValuations';

export function withAssetClassPortfolios<
	T extends { portfolios: AssetClassPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithAssetClassPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: string;
			assetIds: string[];
			assets: AssetItem[];
			transactions: Transaction[];
			latest: boolean;
		}
	) {
		const WithLoadedValuationsComponent = withValuations(Component);

		return (
			<WithLoadedValuationsComponent
				{...(props as unknown as T)}
				currency={props.currency}
				assetIds={props.assetIds}
				assetItems={props.assets}
				transactions={props.transactions}
				idSelector={(assetItem) => assetItem.assetClass}
				portfolioFn={calculateAssetClassPortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateAssetClassPortfolio(
	assets: AssetItem[],
	portfolio: Portfolio
): AssetClassPortfolio {
	return {
		...portfolio,
		type: PortfolioType.PerAssetClass,
	};
}
