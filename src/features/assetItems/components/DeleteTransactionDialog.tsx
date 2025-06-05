import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AssetItemPortfolio, Transaction } from '@/types';
import { useDeleteTransactionMutation } from '@/features/assetItems/hooks/transactions';
import React from 'react';
import CurrencyAmount from '@/components/CurrencyAmount';
import { DateTime } from 'luxon';

export default function DeleteTransactionDialog({
	assetItem,
	transaction,
}: {
	assetItem: AssetItemPortfolio;
	transaction: Transaction;
}) {
	const { mutateAsync: deleteTransactionAsync } =
		useDeleteTransactionMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive'>Delete</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						transaction.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<InfoLine label='Date' value={transaction.date} />
					<InfoLine label='Transaction Name' value={transaction.name} />
					<InfoLine label='Transaction Type' value={transaction.type} />
					<InfoLine label='Asset Item Name' value={assetItem.name} />
					<InfoLine label='Units' value={transaction.units.toString()} />
					<InfoLine
						label='Transaction Amount'
						value={<CurrencyAmount amount={transaction.amount} />}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant='destructive' asChild>
						<AlertDialogAction
							onClick={async () => {
								await deleteTransactionAsync({
									assetItemId: assetItem.id,
									transactionId: transaction.id,
									date: DateTime.fromISO(transaction.date).toJSDate(),
								});
							}}>
							Delete
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className='flex'>
			<div className='text-sm font-semibold mr-2'>{label}:</div>
			<div className='text-sm'>{value}</div>
		</div>
	);
}
