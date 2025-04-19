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
import { AssetItemPortfolio } from '@/features/lib/types';
import { displayPercentage } from '@/lib/utils';
import { useDeleteAssetItemMutation } from '@/features/assetItems/hooks/assetItems';
import React from 'react';
import CurrencyAmount from '@/components/CurrencyAmount';

export default function DeleteAssetItemDialog({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	const { mutateAsync: deleteAssetAsync } = useDeleteAssetItemMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive'>Delete</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the asset
						item.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<InfoLine label='Asset Name' value={assetItem.assetName} />
					<InfoLine label='Asset Type' value={assetItem.assetType} />
					<InfoLine
						label='Invested Value'
						value={<CurrencyAmount amount={assetItem.investedValue} />}
					/>
					<InfoLine
						label='Current Value'
						value={<CurrencyAmount amount={assetItem.currentValue} />}
					/>
					<InfoLine
						label='XIRR'
						value={displayPercentage(assetItem.xirrPercent)}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant='destructive' asChild>
						<AlertDialogAction
							onClick={async () => {
								await deleteAssetAsync(assetItem.id);
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
