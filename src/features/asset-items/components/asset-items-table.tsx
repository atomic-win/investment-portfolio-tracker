import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";

import CurrencyAmount from "@/components/currency-amount";
import { Button } from "@/components/ui/button";
import { createColumnDef, DataTable } from "@/components/ui/data-table";
import DeleteAssetItemDialog from "@/features/asset-items/components/delete-asset-item-dialog";
import {
	displayAssetClassText,
	displayAssetTypeText,
	displayPercentage,
} from "@/lib/utils";
import type { AssetItemPortfolio } from "@/types";

const columns: ColumnDef<AssetItemPortfolio>[] = [
	createColumnDef({
		accessorKey: "id",
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
	}),
	createColumnDef({
		accessorKey: "assetClass",
		id: "Asset Class",
		headerText: "Asset Class",
		cellTextFn: (data) => displayAssetClassText(data.assetClass),
		align: "left",
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
	return (
		<div className="mx-auto">
			<DataTable
				id="asset-items"
				columns={columns}
				data={portfolios}
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
