import {
	type Query,
	type QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import _ from "lodash";
import type {
	AddAssetItemRequest,
	EditAssetItemRequest,
} from "@/features/asset-items/schema";
import { usePrimalApiClient } from "@/hooks/use-primal-api-client";
import { type AssetItem, AssetType } from "@/types";

export function useAllAssetItemsQuery() {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ["assetitems", "all"],
		queryFn: async () => {
			const response = await primalApiClient.get("asset-items");
			return response.data as AssetItem[];
		},
	});
}

export function useAddAssetItemMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (assetItem: AddAssetItemRequest) => {
			const requestBody =
				assetItem.assetType !== AssetType.MutualFund &&
				assetItem.assetType !== AssetType.Stock
					? assetItem
					: {
							...assetItem,
							externalId:
								assetItem.assetType === AssetType.MutualFund
									? // biome-ignore lint/style/noNonNullAssertion: schemeCode is required for Mutual Fund, so it will never be null or undefined here
										assetItem.schemeCode!.toString()
									: assetItem.symbol,
						};

			await primalApiClient.post(
				"asset-items",
				_.omit(requestBody, ["schemeCode", "symbol"]),
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["assetitems", "all"],
			});
		},
	});
}

export function useDeleteAssetItemMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (assetItemId: string) => {
			await primalApiClient.delete(`asset-items/${assetItemId}`);
		},
		onSuccess: async (_data, assetItemId) => {
			queryClient.removeQueries({
				predicate: (query) => isQueryRelatedToAssetItem(query, { assetItemId }),
			});

			await refreshAssetItems(queryClient);
		},
	});
}

export function useEditAssetItemMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async ({ assetItemId, ...data }: EditAssetItemRequest) => {
			await primalApiClient.patch(`asset-items/${assetItemId}`, data);
		},
		onSuccess: async (_data, { assetItemId }) => {
			await refreshAssetItem(queryClient, { assetItemId });
			await queryClient.invalidateQueries({
				queryKey: ["assetitems", "all"],
			});
		},
	});
}

export async function refreshAssetItems(queryClient: QueryClient) {
	return await queryClient.invalidateQueries({
		predicate: (query) =>
			query.queryKey[0] === "assetitems" || query.queryKey[0] === "valuations",
	});
}

export async function refreshAssetItem(
	queryClient: QueryClient,
	request: {
		assetItemId: string;
	},
) {
	return await queryClient.invalidateQueries({
		predicate: (query) => isQueryRelatedToAssetItem(query, request),
	});
}

function isQueryRelatedToAssetItem(
	query: Query<unknown, Error, unknown, readonly unknown[]>,
	request: { assetItemId: string },
) {
	if (
		query.queryKey[0] !== "assetitems" &&
		query.queryKey[0] !== "valuations"
	) {
		return false;
	}

	if (
		query.queryKey[1] === request.assetItemId &&
		query.queryKey[2] === "transactions"
	) {
		return true;
	}

	if (query.queryKey[0] !== "valuations") {
		return false;
	}

	const valuationQueryData = query.queryKey[1] as {
		assetItemIds: string[];
	};

	return valuationQueryData.assetItemIds.includes(request.assetItemId);
}
