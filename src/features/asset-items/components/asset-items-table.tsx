import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";

import CurrencyAmount from "@/components/currency-amount";
import { Button } from "@/components/ui/button";
import { createColumnDef, DataTable } from "@/components/ui/data-table";
import type { DataTableFilterConfig } from "@/components/ui/data-table-toolbar";
import DeleteAssetItemDialog from "@/features/asset-items/components/delete-asset-item-dialog";
import {
	displayAssetClassText,
	displayAssetTypeText,
	displayPercentage,
} from "@/lib/utils";
import type { AssetItemPortfolio } from "@/types";

const columns: ColumnDef<AssetItemPortfolio>[] = [
	createColumnDef({
		accessorKey: "name",
		id: "Asset Item",
		headerText: "Asset Item",
		linkFn: (data) => `/asset-items/${data.id}`,
		cellTextFn: (data) => data.name,
		align: "left",
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: "assetType",
		id: "Asset Type",
		headerText: "Asset Type",
		cellTextFn: (data) => displayAssetTypeText(data.assetType),
		sortingFnCompare: (data) => displayAssetTypeText(data.assetType),
		align: "left",
		filterFn: (row, columnId, filterValues: string[]) => {
			return filterValues.includes(row.getValue<string>(columnId));
		},
	}),
	createColumnDef({
		accessorKey: "assetClass",
		id: "Asset Class",
		headerText: "Asset Class",
		cellTextFn: (data) => displayAssetClassText(data.assetClass),
		align: "left",
		filterFn: (row, columnId, filterValues: string[]) => {
			return filterValues.includes(row.getValue<string>(columnId));
		},
	}),
	createColumnDef({
		accessorKey: "investedValue",
		id: "Invested Value",
		headerText: "Invested Value",
		cellTextFn: (data) => <CurrencyAmount amount={data.investedValue} />,
		sortingFnCompare: (data) => data.investedValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: "investedValuePercent",
		headerText: "Invested Value (%)",
		cellTextFn: (data) => displayPercentage(data.investedValuePercent),
		sortingFnCompare: (data) => data.investedValuePercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: "currentValue",
		id: "Current Value",
		headerText: "Current Value",
		cellTextFn: (data) => <CurrencyAmount amount={data.currentValue} />,
		sortingFnCompare: (data) => data.currentValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: "currentValuePercent",
		headerText: "Current Value (%)",
		cellTextFn: (data) => displayPercentage(data.currentValuePercent),
		sortingFnCompare: (data) => data.currentValuePercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: "xirrPercent",
		headerText: "XIRR (%)",
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
		sortingFnCompare: (data) => data.xirrPercent,
		enableHiding: false,
	}),
	{
		id: "actions",
		cell: ({ row }) => {
			const item = row.original;
			return (
				<div className="flex gap-x-2 justify-center">
					<Link
						to="/asset-items/$assetItemId/edit"
						params={{ assetItemId: item.id }}
					>
						<Button className="cursor-pointer">
							<EditIcon />
							Edit
						</Button>
					</Link>
					<DeleteAssetItemDialog assetItem={item} />
				</div>
			);
		},
	},
];

export default function AssetItemsTable({
	portfolios,
}: {
	portfolios: AssetItemPortfolio[];
}) {
	const presentAssetTypes = [...new Set(portfolios.map((p) => p.assetType))];
	const presentAssetClasses = [...new Set(portfolios.map((p) => p.assetClass))];

	const filters: DataTableFilterConfig[] = [
		{
			type: "text",
			columnId: "Asset Item",
			placeholder: "Filter by name...",
		},
		{
			type: "faceted",
			columnId: "Asset Type",
			title: "Asset Type",
			options: presentAssetTypes.map((type) => ({
				label: displayAssetTypeText(type),
				value: type,
			})),
		},
		{
			type: "faceted",
			columnId: "Asset Class",
			title: "Asset Class",
			options: presentAssetClasses.map((cls) => ({
				label: displayAssetClassText(cls),
				value: cls,
			})),
		},
	];

	return (
		<div className="mx-auto">
			<DataTable
				id="asset-items"
				columns={columns}
				data={portfolios}
				filters={filters}
				initialSorting={[
					{
						id: "investedValuePercent",
						desc: true,
					},
				]}
				doPagination={true}
			/>
		</div>
	);
}
