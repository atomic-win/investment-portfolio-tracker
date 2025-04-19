'use client';
import { CardContent } from '@/components/ui/card';
import { AssetItemPortfolio } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
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
import { DateTime } from 'luxon';
import { ChevronDown } from 'lucide-react';
import { AssetType, TransactionType } from '@/types';

const schema = z.object({
	date: z.date({
		required_error: 'Transaction date is required',
	}),
	name: z
		.string()
		.min(4, {
			message: 'Transaction name must be at least 4 characters',
		})
		.max(100, {
			message: 'Transaction name must be at most 100 characters',
		}),
	transactionType: z.nativeEnum(TransactionType, {
		required_error: 'Transaction type is required',
	}),
	units: z.coerce.number().int().positive({
		message: 'Units must be greater than 0',
	}),
});

export default function AddTransactionForm({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	const { mutateAsync: addTransactionAsync } = useAddTransactionMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			date: new Date(),
			transactionType: TransactionType.Unknown,
			units: 0,
		},
	});

	async function onSubmit(data: z.infer<typeof schema>) {
		await addTransactionAsync({
			date: DateTime.fromJSDate(data.date).toISODate()!,
			name: data.name,
			assetItemId: assetItem.id,
			type: data.transactionType,
			units: data.units,
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
								<FormDescription>Date of transaction</FormDescription>
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
								<FormDescription>Name of transaction</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='transactionType'
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
														{type}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Type of transaction</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='units'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Units</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>Number of units</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<Button type='submit'>Add Transaction</Button>
					</div>
				</form>
			</Form>
		</CardContent>
	);
}

function getApplicableTransactionTypes(
	assetType: AssetType
): TransactionType[] {
	switch (assetType) {
		case AssetType.CashAccount:
		case AssetType.FixedDeposit:
		case AssetType.EPF:
		case AssetType.PPF:
			return [
				TransactionType.Deposit,
				TransactionType.Withdrawal,
				TransactionType.Interest,
				TransactionType.SelfInterest,
				TransactionType.InterestPenalty,
			];
		case AssetType.MutualFund:
			return [TransactionType.Buy, TransactionType.Sell];
		case AssetType.Stock:
			return [
				TransactionType.Buy,
				TransactionType.Sell,
				TransactionType.Dividend,
			];
		default:
			throw new Error(`Unsupported asset type: ${assetType}`);
	}
}
