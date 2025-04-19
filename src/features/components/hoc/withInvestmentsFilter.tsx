'use client';
import React from 'react';
import { AssetItem } from '@/features/lib/types';
import { useSearchParams } from 'next/navigation';
import { AssetClass, AssetType } from '@/types';

export default function withInvestmentsFilter<
	T extends {
		assetIds: string[];
		assets: AssetItem[];
	}
>(Component: React.ComponentType<T>) {
	return function WithInvestmentsFilter(props: Omit<T, 'assetIds'>) {
		const { assets } = props;
		const searchParams = useSearchParams();

		const filteredAssetClasses = (searchParams.getAll('assetClass') ||
			[]) as AssetClass[];

		const filteredAssetTypes = (searchParams.getAll('assetType') ||
			[]) as AssetType[];

		const filteredAssetIds = searchParams.getAll('assetIds') || [];

		const applicableAssetIds = calculateApplicableAssetIds(
			filteredAssetClasses,
			filteredAssetTypes,
			filteredAssetIds,
			assets
		);

		return (
			<Component
				{...(props as T)}
				assetIds={applicableAssetIds}
				assets={assets}
			/>
		);
	};
}

function calculateApplicableAssetIds(
	filteredAssetClasses: AssetClass[],
	filteredAssetTypes: AssetType[],
	filteredAssetIds: string[],
	assets: AssetItem[]
): string[] {
	if (filteredAssetIds.length !== 0) {
		return filteredAssetIds;
	}

	return assets
		.filter(
			(asset) =>
				filteredAssetClasses.length === 0 ||
				filteredAssetClasses.includes(asset.assetClass)
		)
		.filter(
			(asset) =>
				filteredAssetTypes.length === 0 ||
				filteredAssetTypes.includes(asset.assetType)
		)
		.map((asset) => asset.id);
}
