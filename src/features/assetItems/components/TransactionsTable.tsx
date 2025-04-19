'use client';
import { AssetItemPortfolio, Transaction } from '@/features/lib/types';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import DeleteTransactionDialog from '@/features/assetItems/components/DeleteTransactionDialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import CurrencyAmount from '@/components/CurrencyAmount';

type TableItem = Transaction & {
	assetItem: AssetItemPortfolio;
};

const columns: ColumnDef<TableItem>[] = [
	createColumnDef({
		accessorKey: 'date',
		headerText: 'Date',
		cellTextFn: (item) => item.date,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionName',
		id: 'Transaction Name',
		headerText: 'Transaction Name',
		cellTextFn: (item) => item.name,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionType',
		id: 'Transaction Type',
		headerText: 'Transaction Type',
		cellTextFn: (item) => item.type,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'units',
		headerText: 'Units',
		cellTextFn: (item) => item.units.toString(),
		align: 'right',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionAmount',
		headerText: 'Transaction Amount',
		cellTextFn: (item) => <CurrencyAmount amount={item.amount} />,
		align: 'right',
		enableHiding: false,
	}),
	{
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
	},
];

export default function TransactionsTable({
	assetItem,
	transactions,
}: {
	assetItem: AssetItemPortfolio;
	transactions: Transaction[];
}) {
	const items = transactions.map((transaction) => ({
		...transaction,
		assetItem,
	}));

	return (
		<div className='mx-auto'>
			<div className='flex justify-end text-xl font-semibold items-center'>
				<Button>
					<PlusIcon />
					<Link href={`/assetitems/${assetItem.id}/transactions/add`}>
						Add Transaction
					</Link>
				</Button>
			</div>
			<DataTable
				columns={columns}
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
