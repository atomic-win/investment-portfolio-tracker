'use client';
import { CardContent } from '@/components/ui/card';
import { AssetItemPortfolio, AssetType, TransactionType } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
	FormControl,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAddTransactionMutation } from '@/features/assetItems/hooks/transactions';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { displayTransactionTypeText } from '@/lib/utils';
import {
	AddTransactionRequest,
	AddTransactionSchema,
	getApplicableTransactionTypes,
} from '@/features/assetItems/schema';

export default function AddTransactionForm({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	const { mutateAsync: addTransactionAsync } = useAddTransactionMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof AddTransactionSchema>>({
		resolver: zodResolver(AddTransactionSchema),
		defaultValues: {
			date: new Date(),
			type: TransactionType.Unknown,
			units: 0,
		},
	});

	async function onSubmit(data: Omit<AddTransactionRequest, 'assetItemId'>) {
		await addTransactionAsync({
			...data,
			assetItemId: assetItem.id,
		});

		router.back();
	}

	return (
		<CardContent className='p-0'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col space-y-4'>
					<FormField
						control={form.control}
						name='date'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Transaction Date</FormLabel>
								<FormControl>
									<DatePicker date={field.value} onSelect={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
									{getUnitLabel(assetItem, form.watch('type'))}
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
							Add Transaction
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
