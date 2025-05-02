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
	return function WithAssetTypePortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: string;
			assetItemIds: string[];
			assetItems: AssetItem[];
			latest: boolean;
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
				idSelector={(assetItem) => assetItem.assetType}
				portfolioFn={calculateAssetTypePortfolio}
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
