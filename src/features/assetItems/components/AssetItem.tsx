'use client';
import React from 'react';

import CurrencyAmount from '@/components/CurrencyAmount';
import withCurrency from '@/components/hoc/withCurrency';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TransactionsTable from '@/features/transactions/components/TransactionsTable';
import {
	displayAssetClassText,
	displayAssetTypeText,
	displayPercentage,
} from '@/lib/utils';
import { AssetItemPortfolio } from '@/types';

export default function AssetItem({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	const WithLoadedTransactionsTable = withCurrency(TransactionsTable);

	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='grid grid-cols-3 justify-between gap-2'>
					<InfoLine label='Asset Item Name' value={assetItem.name} />
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
				<Separator />
			</CardHeader>
			<CardContent className='mt-0 space-y-4'>
				<WithLoadedTransactionsTable assetItem={assetItem} />
			</CardContent>
		</Card>
	);
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className='flex'>
			<div className='text-lg font-semibold mr-2'>{label}:</div>
			<div className='text-lg'>{value}</div>
		</div>
	);
}
