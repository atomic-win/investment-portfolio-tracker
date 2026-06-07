import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { EditIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import CurrencyAmount from "@/components/currency-amount";
import ErrorComponent from "@/components/error-component";
import LoadingComponent from "@/components/loading-component";
import { Button } from "@/components/ui/button";
import { createColumnDef, DataTable } from "@/components/ui/data-table";
import type { DataTableFilterConfig } from "@/components/ui/data-table-toolbar";
import { refreshAssetItem } from "@/features/asset-items/hooks/asset-items";
import DeleteTransactionDialog from "@/features/transactions/components/delete-transaction-dialog";
import { useAssetItemTransactionsQuery } from "@/features/transactions/hooks/transactions";
import { displayTransactionTypeText } from "@/features/transactions/lib/utils";
import {
	type AssetItemPortfolio,
	AssetType,
	type Currency,
	type Transaction,
	TransactionType,
} from "@/types";

type TableItem = Transaction & {
	assetItem: AssetItemPortfolio;
};

export default function TransactionsTable({
	assetItem,
	currency,
}: {
	assetItem: AssetItemPortfolio;
	currency: Currency;
}) {
	const queryClient = useQueryClient();

	const {
		data: transactions,
		isFetching,
		isError,
	} = useAssetItemTransactionsQuery(assetItem.id, currency);

	if (isFetching) {
		return <LoadingComponent loadingMessage="Fetching transactions" />;
	}

	if (isError || !transactions) {
		return <ErrorComponent errorMessage="Failed while fetching transactions" />;
	}

	const sortedTransactions = _.orderBy(
		transactions,
		["date", "id"],
		["desc", "desc"],
	);

	const items = sortedTransactions.map((transaction) => ({
		...transaction,
		assetItem,
	}));

	const presentTransactionTypes = [
		...new Set(sortedTransactions.map((t) => t.transactionType)),
	];

	const filters: DataTableFilterConfig[] = [
		{
			type: "text",
			columnId: "Transaction Name",
			placeholder: "Filter by name...",
		},
		{
			type: "faceted",
			columnId: "Transaction Type",
			title: "Transaction Type",
			options: presentTransactionTypes.map((type) => ({
				label: displayTransactionTypeText(type),
				value: type,
			})),
		},
	];

	return (
		<div className="mx-auto">
			<div className="flex justify-end text-xl font-semibold items-center gap-x-2">
				<Link
					to="/asset-items/$assetItemId/transactions/add"
					params={{ assetItemId: assetItem.id }}
				>
					<Button className="cursor-pointer" disabled={isFetching}>
						<PlusIcon />
						Add Transaction
					</Button>
				</Link>
				<Button
					className="cursor-pointer"
					disabled={isFetching}
					onClick={async () =>
						await refreshAssetItem(queryClient, {
							assetItemId: assetItem.id,
						})
					}
				>
					<RefreshCwIcon />
					Refresh
				</Button>
			</div>
			<DataTable
				id="transactions"
				columns={getColumns(assetItem)}
				data={items}
				filters={filters}
				initialSorting={[
					{
						id: "date",
						desc: true,
					},
				]}
				doPagination={true}
			/>
		</div>
	);
}

function getColumns(assetItem: AssetItemPortfolio): ColumnDef<TableItem>[] {
	const columns: ColumnDef<TableItem>[] = [];

	columns.push(
		createColumnDef({
			accessorKey: "date",
			headerText: "Date",
			cellTextFn: (item) => item.date,
			align: "left",
			enableHiding: false,
		}),
	);

	columns.push(
		createColumnDef({
			accessorKey: "name",
			id: "Transaction Name",
			headerText: "Transaction Name",
			cellTextFn: (item) => item.name,
			align: "left",
			enableHiding: false,
		}),
	);

	columns.push(
		createColumnDef({
			accessorKey: "transactionType",
			id: "Transaction Type",
			headerText: "Transaction Type",
			cellTextFn: (item) => displayTransactionTypeText(item.transactionType),
			align: "left",
			enableHiding: false,
			filterFn: (row, columnId, filterValues: string[]) => {
				const value = row.getValue<string>(columnId);
				return filterValues.includes(value);
			},
		}),
	);

	if (shouldShowUnitsColumn(assetItem)) {
		columns.push(
			createColumnDef({
				accessorKey: "units",
				headerText: "Units",
				cellTextFn: (item) =>
					item.transactionType === TransactionType.Dividend
						? "-"
						: item.units.toString(),
				align: "right",
				enableHiding: false,
			}),
		);
	}

	columns.push(
		createColumnDef({
			accessorKey: "transactionAmount",
			headerText: "Transaction Amount",
			cellTextFn: (item) => <CurrencyAmount amount={item.amount} />,
			align: "right",
			enableHiding: false,
		}),
	);

	columns.push({
		id: "actions",
		cell: ({ row }) => {
			const item = row.original;
			return (
				<div className={"flex gap-x-2 justify-center"}>
					<DeleteTransactionDialog
						assetItem={item.assetItem}
						transaction={item}
					/>
					<Link
						to="/asset-items/$assetItemId/transactions/$transactionId/edit"
						params={{ assetItemId: assetItem.id, transactionId: item.id }}
					>
						<Button className="cursor-pointer">
							<EditIcon />
							Edit
						</Button>
					</Link>
				</div>
			);
		},
	});

	return columns;
}

function shouldShowUnitsColumn(assetItem: AssetItemPortfolio) {
	return (
		assetItem.assetType === AssetType.MutualFund ||
		assetItem.assetType === AssetType.Stock ||
		assetItem.assetType === AssetType.ETF
	);
}
