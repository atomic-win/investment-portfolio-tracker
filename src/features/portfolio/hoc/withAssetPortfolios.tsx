import {
	AssetItemPortfolio,
	AssetItem,
	Portfolio,
	PortfolioType,
	Transaction,
} from '@/features/lib/types';
import { findAssetItemById } from '@/features/lib/utils';
import { withValuations } from '@/features/components/hoc/withValuations';

export function withAssetPortfolios<
	T extends {
		portfolios: AssetItemPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return function WithAssetPortfolios(
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
				assetIds={
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
	const assetItem = findAssetItemById(assetItems, portfolio.id)!;

	return {
		...portfolio,
		type: PortfolioType.PerAsset,
		assetName: assetItem.name,
		assetClass: assetItem.assetClass,
		assetType: assetItem.assetType,
	};
}
