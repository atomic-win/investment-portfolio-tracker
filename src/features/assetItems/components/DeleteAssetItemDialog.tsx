import React from 'react';

import CurrencyAmount from '@/components/CurrencyAmount';
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
import { buttonVariants } from '@/components/ui/button';
import { useDeleteAssetItemMutation } from '@/features/assetItems/hooks/assetItems';
import {
	cn,
	displayAssetClassText,
	displayAssetTypeText,
	displayPercentage,
} from '@/lib/utils';
import { AssetItemPortfolio } from '@/types';

export default function DeleteAssetItemDialog({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	const { mutateAsync: deleteAssetItemAsync } = useDeleteAssetItemMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger
				className={cn(
					'cursor-pointer',
					buttonVariants({ variant: 'destructive' })
				)}
			>
				Delete
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete the asset item.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<InfoLine label='Asset Name' value={assetItem.name} />
					<InfoLine
						label='Asset Type'
						value={displayAssetTypeText(assetItem.assetType)}
					/>
					<InfoLine
						label='Asset Class'
						value={displayAssetClassText(assetItem.assetClass)}
					/>
					<InfoLine
						label='Invested Value'
						value={
							<CurrencyAmount amount={assetItem.investedValue} />
						}
					/>
					<InfoLine
						label='Last Month Value'
						value={
							<CurrencyAmount amount={assetItem.currentValue} />
						}
					/>
					<InfoLine
						label='XIRR'
						value={displayPercentage(assetItem.xirrPercent)}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						className='cursor-pointer'
						onClick={async () => {
							await deleteAssetItemAsync(assetItem.id);
						}}
					>
						Delete
					</AlertDialogAction>
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
