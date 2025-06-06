import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import useValuationQueries from '@/features/portfolio/hooks/valuation';
import { AssetItem, Portfolio, PortfolioType, Valuation } from '@/types';

export function withValuations<
	TPortfolio extends Portfolio,
	T extends {
		portfolios: TPortfolio[];
	}
>(
	Component: React.ComponentType<T>,
	idSelector: (assetItem: AssetItem) => string,
	portfolioFn: (assetItems: AssetItem[], portfolio: Portfolio) => TPortfolio
) {
	return function WithValuations(
		props: Omit<T, 'portfolios'> & {
			assetItems: AssetItem[];
			assetItemIds: string[];
			latest: boolean;
			currency: string;
		}
	) {
		const valuationQueryResults = useValuationQueries(
			props.assetItems,
			props.assetItemIds.length > 0
				? props.assetItemIds
				: props.assetItems.map((assetItem) => assetItem.id),
			props.latest,
			props.currency,
			idSelector
		);

		if (valuationQueryResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching valuations' />;
		}

		if (valuationQueryResults.some((result) => result.isError)) {
			return <ErrorComponent errorMessage='Failed while fetching valuations' />;
		}

		return (
			<Component
				{...(props as unknown as T)}
				portfolios={calculatePortfolios(
					valuationQueryResults.map((result) => result.data!),
					props.latest
				).map((portfolio) => portfolioFn(props.assetItems, portfolio))}
			/>
		);
	};
}

function calculatePortfolios(
	valuations: Valuation[],
	isLatest: boolean
): Portfolio[] {
	const dateToValuations = new Map<string, Valuation[]>();

	for (const valuation of valuations) {
		if (
			!isLatest &&
			valuation.investedValue === 0 &&
			valuation.currentValue === 0 &&
			valuation.xirrPercent === 0
		) {
			continue;
		}
		const valuations = dateToValuations.get(valuation.date) || [];
		valuations.push(valuation);
		dateToValuations.set(valuation.date, valuations);
	}

	return Array.from(dateToValuations.values()).flatMap((valuations) => {
		return calculatePortfolio(valuations);
	});
}

function calculatePortfolio(valuations: Valuation[]): Portfolio[] {
	const totalInvestedValue = valuations.reduce((sum, valuation) => {
		return sum + valuation.investedValue;
	}, 0);

	const totalCurrentValue = valuations.reduce((sum, valuation) => {
		return sum + valuation.currentValue;
	}, 0);

	return valuations.map((valuation) => {
		return {
			id: valuation.id,
			date: valuation.date,
			type: PortfolioType.Unknown,
			investedValue: valuation.investedValue,
			investedValuePercent:
				(valuation.investedValue / Math.max(totalInvestedValue, 1)) * 100,
			currentValue: valuation.currentValue,
			currentValuePercent:
				(valuation.currentValue / Math.max(totalCurrentValue, 1)) * 100,
			xirrPercent: valuation.xirrPercent,
		};
	});
}
