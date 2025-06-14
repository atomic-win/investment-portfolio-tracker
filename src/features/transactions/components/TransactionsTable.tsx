'use client';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';

import CurrencyAmount from '@/components/CurrencyAmount';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Button } from '@/components/ui/button';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { refreshAssetItem } from '@/features/assetItems/hooks/assetItems';
import DeleteTransactionDialog from '@/features/transactions/components/DeleteTransactionDialog';
import { useAssetItemTransactionsQuery } from '@/features/transactions/hooks/transactions';
import { displayTransactionTypeText } from '@/lib/utils';
import {
	AssetItemPortfolio,
	AssetType,
	Currency,
	Transaction,
	TransactionType,
} from '@/types';

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
		isLoading,
		isFetching,
		isError,
	} = useAssetItemTransactionsQuery(assetItem.id, currency);

	if (isLoading) {
		return <LoadingComponent loadingMessage='Fetching transactions' />;
	}

	if (isError || !transactions) {
		return <ErrorComponent errorMessage='Failed while fetching transactions' />;
	}

	const items = transactions.map((transaction) => ({
		...transaction,
		assetItem,
	}));

	return (
		<div className='mx-auto'>
			<div className='flex justify-end text-xl font-semibold items-center gap-x-2'>
				<Link href={`/assetitems/${assetItem.id}/transactions/add`}>
					<Button className='cursor-pointer' disabled={isFetching}>
						<PlusIcon />
						Add Transaction
					</Button>
				</Link>
				<Button
					className='cursor-pointer'
					disabled={isFetching}
					onClick={async () =>
						await refreshAssetItem(queryClient, {
							assetItemId: assetItem.id,
						})
					}>
					<RefreshCwIcon />
					Refresh
				</Button>
			</div>
			<DataTable
				id='transactions'
				columns={getColumns(assetItem)}
				data={items}
				initialSorting={[
					{
						id: 'date',
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
			accessorKey: 'date',
			headerText: 'Date',
			cellTextFn: (item) => item.date,
			align: 'left',
			enableHiding: false,
		})
	);

	columns.push(
		createColumnDef({
			accessorKey: 'transactionName',
			id: 'Transaction Name',
			headerText: 'Transaction Name',
			cellTextFn: (item) => item.name,
			align: 'left',
			enableHiding: false,
		})
	);

	columns.push(
		createColumnDef({
			accessorKey: 'transactionType',
			id: 'Transaction Type',
			headerText: 'Transaction Type',
			cellTextFn: (item) => displayTransactionTypeText(item.type),
			align: 'left',
			enableHiding: false,
		})
	);

	if (shouldShowUnitsColumn(assetItem)) {
		columns.push(
			createColumnDef({
				accessorKey: 'units',
				headerText: 'Units',
				cellTextFn: (item) =>
					item.type === TransactionType.Dividend ? '-' : item.units.toString(),
				align: 'right',
				enableHiding: false,
			})
		);
	}

	columns.push(
		createColumnDef({
			accessorKey: 'transactionAmount',
			headerText: 'Transaction Amount',
			cellTextFn: (item) => <CurrencyAmount amount={item.amount} />,
			align: 'right',
			enableHiding: false,
		})
	);

	columns.push({
		id: 'actions',
		cell: ({ row }) => {
			const item = row.original;
			return (
				<DeleteTransactionDialog
					assetItem={item.assetItem}
					transaction={item}
				/>
			);
		},
	});

	return columns;
}

function shouldShowUnitsColumn(assetItem: AssetItemPortfolio) {
	return (
		assetItem.assetType === AssetType.MutualFund ||
		assetItem.assetType === AssetType.Stock
	);
}
