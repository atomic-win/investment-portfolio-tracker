import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useAllAssetItemsQuery } from "@/features/assetItems/hooks/assetItems";
import type { AssetItem } from "@/types";

export default function withAssetItems<T extends { assetItems: AssetItem[] }>(
	Component: React.ComponentType<T>,
) {
	return function WithAssets(props: Omit<T, "assetItems">) {
		const { data: assetItems, isFetching, error } = useAllAssetItemsQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage="Fetching asset items" />;
		}

		if (error || !assetItems) {
			return (
				<ErrorComponent errorMessage="Failed while fetching asset items" />
			);
		}

		// biome-ignore lint/style/noNonNullAssertion: we check for assetItems being undefined above, so it can't be undefined here
		return <Component {...(props as T)} assetItems={assetItems!} />;
	};
}
