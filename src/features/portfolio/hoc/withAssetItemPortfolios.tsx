import {
	AssetItemPortfolio,
	AssetItem,
	Portfolio,
	PortfolioType,
} from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetItemPortfolios<
	T extends {
		portfolios: AssetItemPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return function WithAssetItemPortfolios(
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
				assetItemIds={
					props.assetItemIds.length > 0
						? props.assetItemIds
						: props.assetItems.map((assetItem) => assetItem.id)
				}
				latest={props.latest}
				currency={props.currency}
				idSelector={(assetItem) => assetItem.id}
				portfolioFn={calculateAssetItemPortfolio}
			/>
		);
	};
}

function calculateAssetItemPortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio
): AssetItemPortfolio {
	const assetItem = (assetItems || []).find(
		(assetItem) => assetItem.id === portfolio.id
	)!;

	return {
		...portfolio,
		type: PortfolioType.PerAssetItem,
		name: assetItem.name,
		assetClass: assetItem.assetClass,
		assetType: assetItem.assetType,
	};
}
