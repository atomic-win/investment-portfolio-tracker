import {
	OverallPortfolio,
	Portfolio,
	AssetItem,
	PortfolioType,
	Transaction,
} from '@/features/lib/types';
import { withValuations } from '@/features/components/hoc/withValuations';

export function withOverallPortfolios<
	T extends { portfolios: OverallPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithOverallPortfolios(
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
				assetIds={props.assetItemIds}
				assetItems={props.assetItems}
				transactions={props.transactions}
				idSelector={() => 'overall'}
				portfolioFn={calculateOverallPortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateOverallPortfolio(
	assetItems: AssetItem[],
	portfolio: Portfolio
): OverallPortfolio {
	return {
		...portfolio,
		type: PortfolioType.Overall,
	};
}
