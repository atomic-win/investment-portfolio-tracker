'use client';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { useAllAssetItemsQuery } from '@/features/assetItems/hooks/assetItems';
import { AssetItem } from '@/types';

export default function withAssetItems<T extends { assetItems: AssetItem[] }>(
	Component: React.ComponentType<T>
) {
	return function WithAssets(props: Omit<T, 'assetItems'>) {
		const { data: assetItems, isFetching, error } = useAllAssetItemsQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching asset items' />;
		}

		if (error || !assetItems) {
			return (
				<ErrorComponent errorMessage='Failed while fetching asset items' />
			);
		}

		return <Component {...(props as T)} assetItems={assetItems!} />;
	};
}
