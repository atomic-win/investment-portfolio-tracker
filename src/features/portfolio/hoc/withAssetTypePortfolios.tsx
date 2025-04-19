import {
	AssetTypePortfolio,
	Portfolio,
	AssetItem,
	Transaction,
	PortfolioType,
} from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetTypePortfolios<
	T extends { portfolios: AssetTypePortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithAssetTypePortfolios(
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
				idSelector={(assetItem) => assetItem.assetType}
				portfolioFn={calculateAssetTypePortfolio}
				latest={props.latest}
			/>
		);
	};
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
