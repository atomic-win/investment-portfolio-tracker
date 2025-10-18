'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
	FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	EditTransactionRequest,
	EditTransactionSchema,
	getApplicableTransactionTypes,
} from '@/features/assetItems/schema';
import { useEditTransactionMutation } from '@/features/transactions/hooks/transactions';
import { displayTransactionTypeText } from '@/lib/utils';
import {
	AssetItemPortfolio,
	AssetType,
	Transaction,
	TransactionType,
} from '@/types';

export default function EditTransactionForm({
	assetItem,
	transaction,
}: {
	assetItem: AssetItemPortfolio;
	transaction: Transaction;
}) {
	const { mutateAsync: editTransactionAsync } = useEditTransactionMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof EditTransactionSchema>>({
		resolver: zodResolver(EditTransactionSchema),
		defaultValues: {
			name: transaction.name,
			type: transaction.type,
			units: transaction.units,
		},
	});

	async function onSubmit(
		data: Omit<EditTransactionRequest, 'assetItemId' | 'transactionId'>
	) {
		await editTransactionAsync({
			...data,
			assetItemId: assetItem.id,
			transactionId: transaction.id,
		});

		router.back();
	}

	return (
		<CardContent className='p-0'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col space-y-4'>
					<Label>Transaction Date</Label>
					<DatePicker date={DateTime.fromISO(transaction.date)!.toJSDate()} />
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transaction Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='type'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transaction Type</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger
											className='w-full rounded-lg sm:ml-auto'
											aria-label='Select a value'>
											<SelectValue placeholder='Select a transaction type' />
											<SelectIcon>
												<ChevronDown className='h-4 w-4 opacity-50' />
											</SelectIcon>
										</SelectTrigger>
										<SelectContent className='rounded-xl'>
											{getApplicableTransactionTypes(assetItem.assetType)
												.filter((type) => type !== TransactionType.Unknown)
												.map((type) => (
													<SelectItem
														key={type}
														value={type}
														className='rounded-lg'>
														{displayTransactionTypeText(type)}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='units'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{getUnitLabel(assetItem, form.watch('type')!)}
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<Button type='submit' className='cursor-pointer'>
							Edit Transaction
						</Button>
					</div>
				</form>
			</Form>
		</CardContent>
	);
}

function getUnitLabel(
	assetItem: AssetItemPortfolio,
	transactionType: TransactionType
) {
	switch (assetItem.assetType) {
		case AssetType.BankAccount:
		case AssetType.Wallet:
		case AssetType.FixedDeposit:
		case AssetType.EPF:
		case AssetType.PPF:
		case AssetType.TBill:
			return getAmountLabel(assetItem);
		case AssetType.MutualFund:
			return 'Units';
		case AssetType.Stock:
			return transactionType === TransactionType.Dividend
				? getAmountLabel(assetItem)
				: 'Shares';
		default:
			throw new Error(`Unsupported asset type: ${assetItem.assetType}`);
	}
}

function getAmountLabel(assetItem: AssetItemPortfolio) {
	return `Amount (${assetItem.currency})`;
}
