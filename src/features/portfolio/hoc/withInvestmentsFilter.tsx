import { useSearch } from "@tanstack/react-router";
import type React from "react";

import type { AssetClass, AssetItem, AssetType } from "@/types";

export default function withInvestmentsFilter<
	T extends {
		assetItemIds: string[];
		assetItems: AssetItem[];
	},
>(Component: React.ComponentType<T>) {
	return function WithInvestmentsFilter(props: Omit<T, "assetItemIds">) {
		const { assetItems } = props;
		const search = useSearch({ strict: false }) as Record<string, unknown>;

		const filteredAssetClasses = (search.assetClass as AssetClass[]) || [];
		const filteredAssetTypes = (search.assetType as AssetType[]) || [];
		const filteredAssetItemIds = (search.assetItemId as string[]) || [];

		const applicableAssetItemIds = calculateApplicableAssetItemIds(
			filteredAssetClasses,
			filteredAssetTypes,
			filteredAssetItemIds,
			assetItems,
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
	assetItems: AssetItem[],
): string[] {
	if (filteredAssetItemIds.length !== 0) {
		return filteredAssetItemIds;
	}

	return assetItems
		.filter(
			(assetItem) =>
				filteredAssetClasses.length === 0 ||
				filteredAssetClasses.includes(assetItem.assetClass),
		)
		.filter(
			(assetItem) =>
				filteredAssetTypes.length === 0 ||
				filteredAssetTypes.includes(assetItem.assetType),
		)
		.map((assetItem) => assetItem.id);
}
