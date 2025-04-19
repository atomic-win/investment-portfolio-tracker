import {
	AssetTypePortfolio,
	Portfolio,
	AssetItem,
	Transaction,
	PortfolioType,
} from '@/features/lib/types';
import { withValuations } from '@/features/components/hoc/withValuations';

export function withAssetTypePortfolios<
	T extends { portfolios: AssetTypePortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithAssetTypePortfolios(
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
				idSelector={(assetItem) => assetItem.assetType}
				portfolioFn={calculateAssetTypePortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateAssetTypePortfolio(
	assets: AssetItem[],
	portfolio: Portfolio
): AssetTypePortfolio {
	return {
		...portfolio,
		type: PortfolioType.PerAssetType,
	};
}
