'use client';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { AssetItem } from '@/features/lib/types';
import { useAllAssetsQuery } from '@/features/hooks/assets';

export default function withAssets<T extends { assetItems: AssetItem[] }>(
	Component: React.ComponentType<T>
) {
	return function WithAssets(props: Omit<T, 'assetItems'>) {
		const { data: assets, isFetching, error } = useAllAssetsQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching assets' />;
		}

		if (error || !assets) {
			return <ErrorComponent errorMessage='Failed while fetching assets' />;
		}

		return <Component {...(props as T)} assetItems={assets!} />;
	};
}
