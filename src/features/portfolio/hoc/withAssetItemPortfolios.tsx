import {
	AssetItemPortfolio,
	AssetItem,
	Portfolio,
	PortfolioType,
	Transaction,
} from '@/types';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export function withAssetItemPortfolios<
	T extends {
		portfolios: AssetItemPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return function WithAssetItemPortfolios(
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
				assetItemIds={
					props.assetItemIds.length > 0
						? props.assetItemIds
						: props.assetItems.map((assetItem) => assetItem.id)
				}
				assetItems={props.assetItems}
				transactions={props.transactions}
				idSelector={(assetItem) => assetItem.id}
				portfolioFn={calculateAssetItemPortfolio}
				latest={props.latest}
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
