import type React from "react";

import withCurrency from "@/components/hoc/with-currency";
import withAssetItems from "@/features/asset-items/hoc/with-asset-items";
import { withAssetItemPortfolios } from "@/features/portfolio/hoc/with-asset-item-portfolios";
import type { AssetItemPortfolio } from "@/types";

export function withAssetItemPortfolio<
	T extends {
		assetItem: AssetItemPortfolio;
	},
>(Component: React.ComponentType<T>) {
	return function Wrapper(
		props: Omit<T, "assetItem" | "portfolios" | "assetItems" | "currency"> & {
			assetItemId: string;
		},
	) {
		const WrappedComponent = withAssetItems(
			withCurrency(withAssetItemPortfolios(WithAssetItemPortfolios(Component))),
		);

		const wrappedProps = {
			...props,
			assetItemIds: [props.assetItemId],
			latest: true,
		} as unknown as React.ComponentProps<typeof WrappedComponent>;

		return <WrappedComponent {...wrappedProps} />;
	};
}

function WithAssetItemPortfolios<
	T extends {
		assetItem: AssetItemPortfolio;
	},
>(Component: React.ComponentType<T>) {
	return function Wrapper(
		props: Omit<T, "assetItem"> & { portfolios: AssetItemPortfolio[] },
	) {
		const assetItem = props.portfolios[0];
		return <Component {...(props as unknown as T)} assetItem={assetItem} />;
	};
}
