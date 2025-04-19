'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AssetItemPortfolio, Transaction } from '@/features/lib/types';
import TransactionsTable from '@/features/assetItems/components/TransactionsTable';
import { Separator } from '@/components/ui/separator';
import { displayPercentage } from '@/features/lib/utils';
import React from 'react';
import CurrencyAmount from '@/components/CurrencyAmount';

export default function AssetItem({
	assetItem,
	transactions,
}: {
	assetItem: AssetItemPortfolio;
	transactions: Transaction[];
}) {
	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='grid grid-cols-3 justify-between gap-2'>
					<InfoLine label='Asset Item Name' value={assetItem.assetName} />
					<InfoLine label='Asset Type' value={assetItem.assetType} />
					<InfoLine label='Asset Class' value={assetItem.assetClass} />
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
				<Separator />
			</CardHeader>
			<CardContent className='mt-0 space-y-4'>
				<TransactionsTable assetItem={assetItem} transactions={transactions} />
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
