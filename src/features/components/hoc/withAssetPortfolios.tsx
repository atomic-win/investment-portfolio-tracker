import {
	AssetItemPortfolio,
	AssetItem,
	Portfolio,
	PortfolioType,
	Transaction,
} from '@/features/lib/types';
import { findAssetById } from '@/features/lib/utils';
import { withValuations } from '@/features/components/hoc/withValuations';

export function withAssetPortfolios<
	T extends {
		portfolios: AssetItemPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return function WithAssetPortfolios(
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
				assetIds={
					props.assetIds.length > 0
						? props.assetIds
						: props.assets.map((asset) => asset.id)
				}
				assets={props.assets}
				transactions={props.transactions}
				idSelector={(asset) => asset.id}
				portfolioFn={calculateAssetPortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateAssetPortfolio(
	assets: AssetItem[],
	portfolio: Portfolio
): AssetItemPortfolio {
	const asset = findAssetById(assets, portfolio.id)!;

	return {
		...portfolio,
		type: PortfolioType.PerAsset,
		assetName: asset.name,
		assetClass: asset.assetClass,
		assetType: asset.assetType,
	};
}
