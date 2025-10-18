import withCurrency from '@/components/hoc/withCurrency';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import { AssetItemPortfolio } from '@/types';

export function withAssetItemPortfolio<
	T extends {
		assetItem: AssetItemPortfolio;
	}
>(Component: React.ComponentType<T>) {
	const WrappedComponent = withAssetItems(
		withCurrency(withAssetItemPortfolios(WithAssetItemPortfolios(Component)))
	);

	return function Wrapper(
		props: Omit<T, 'assetItem'> & { assetItemId: string }
	) {
		return (
			<WrappedComponent
				{...(props as unknown as T)}
				assetItemIds={[props.assetItemId]}
				latest={true}
			/>
		);
	};
}

function WithAssetItemPortfolios<
	T extends {
		assetItem: AssetItemPortfolio;
	}
>(Component: React.ComponentType<T>) {
	return function Wrapper(
		props: Omit<T, 'assetItem'> & { portfolios: AssetItemPortfolio[] }
	) {
		const assetItem = props.portfolios[0];
		return <Component {...(props as unknown as T)} assetItem={assetItem} />;
	};
}
