'use client';
import React from 'react';
import { AssetItem , AssetClass, AssetType } from '@/types';
import { useSearchParams } from 'next/navigation';

export default function withInvestmentsFilter<
	T extends {
		assetItemIds: string[];
		assetItems: AssetItem[];
	}
>(Component: React.ComponentType<T>) {
	return function WithInvestmentsFilter(props: Omit<T, 'assetItemIds'>) {
		const { assetItems } = props;
		const searchParams = useSearchParams();

		const filteredAssetClasses = (searchParams.getAll('assetClass') ||
			[]) as AssetClass[];

		const filteredAssetTypes = (searchParams.getAll('assetType') ||
			[]) as AssetType[];

		const filteredAssetItemIds = searchParams.getAll('assetItemId') || [];

		const applicableAssetItemIds = calculateApplicableAssetItemIds(
			filteredAssetClasses,
			filteredAssetTypes,
			filteredAssetItemIds,
			assetItems
		);

		return (
			<Component
				{...(props as T)}
				assetItemIds={applicableAssetItemIds}
				assetItems={assetItems}
			/>
		);
	};
}

function calculateApplicableAssetItemIds(
	filteredAssetClasses: AssetClass[],
	filteredAssetTypes: AssetType[],
	filteredAssetItemIds: string[],
	assetItems: AssetItem[]
): string[] {
	if (filteredAssetItemIds.length !== 0) {
		return filteredAssetItemIds;
	}

	return assetItems
		.filter(
			(assetItem) =>
				filteredAssetClasses.length === 0 ||
				filteredAssetClasses.includes(assetItem.assetClass)
		)
		.filter(
			(assetItem) =>
				filteredAssetTypes.length === 0 ||
				filteredAssetTypes.includes(assetItem.assetType)
		)
		.map((assetItem) => assetItem.id);
}
