'use client';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	AddTransactionRequest,
	AddTransactionSchema,
	getApplicableTransactionTypes,
} from '@/features/assetItems/schema';
import { useAddTransactionMutation } from '@/features/transactions/hooks/transactions';
import {
	displayTransactionTypeText,
	getUnitLabelText,
} from '@/features/transactions/lib/utils';
import { AssetItemPortfolio, TransactionType } from '@/types';

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
			transactionType: TransactionType.Unknown,
			units: 0,
		},
	});

	async function onSubmit(data: Omit<AddTransactionRequest, 'assetItemId'>) {
		await addTransactionAsync({
			...data,
			assetItemId: assetItem.id,
		});

		router.refresh();
	}

	return (
		<CardContent className='p-0'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col space-y-4'
				>
					<FormField
						control={form.control}
						name='date'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Transaction Date</FormLabel>
								<FormControl>
									<DatePicker
										date={field.value}
										onSelect={field.onChange}
									/>
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
						name='transactionType'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Transaction Type</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<SelectTrigger
											className='w-full rounded-lg sm:ml-auto'
											aria-label='Select a value'
										>
											<SelectValue title='Select a transaction type' />
										</SelectTrigger>
										<SelectContent className='rounded-xl'>
											{getApplicableTransactionTypes(
												assetItem.assetType
											)
												.filter(
													(type) =>
														type !==
														TransactionType.Unknown
												)
												.map((type) => (
													<SelectItem
														key={type}
														value={type}
														className='rounded-lg'
													>
														{displayTransactionTypeText(
															type
														)}
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
									{getUnitLabelText(
										assetItem,
										form.watch('transactionType')
									)}
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
