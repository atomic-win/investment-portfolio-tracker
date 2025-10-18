'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { ChevronDown } from 'lucide-react';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
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
import {
	useEditTransactionMutation,
	useTransactionQuery,
} from '@/features/transactions/hooks/transactions';
import {
	displayTransactionTypeText,
	getUnitLabelText,
} from '@/features/transactions/lib/utils';
import { AssetItemPortfolio, TransactionType } from '@/types';

export default function EditTransactionForm({
	assetItem,
	transactionId,
}: {
	assetItem: AssetItemPortfolio;
	transactionId: string;
}) {
	const { mutateAsync: editTransactionAsync } = useEditTransactionMutation();
	const router = useRouter();
	const {
		data: transaction,
		isLoading,
		isError,
	} = useTransactionQuery(assetItem.id, transactionId, assetItem.currency);

	const form = useForm<z.infer<typeof EditTransactionSchema>>({
		resolver: zodResolver(EditTransactionSchema),
		defaultValues: {
			name: transaction?.name,
			type: transaction?.type,
			units: transaction?.units,
		},
	});

	if (isLoading) {
		return <LoadingComponent loadingMessage='Fetching transaction' />;
	}

	if (isError || !transaction) {
		return <ErrorComponent errorMessage='Failed while fetching transaction' />;
	}

	async function onSubmit(
		data: Omit<EditTransactionRequest, 'assetItemId' | 'transactionId'>
	) {
		await editTransactionAsync({
			..._.pickBy(
				data,
				(value, key) =>
					value !== form.formState.defaultValues![key as keyof typeof data]
			),
			assetItemId: assetItem.id,
			transactionId: transactionId,
		});

		router.refresh();
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
									{getUnitLabelText(assetItem, form.watch('type')!)}
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='number'
										onChange={(e) =>
											field.onChange(
												e.target.value === '' ? '' : Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<Button
							type='submit'
							className='cursor-pointer'
							disabled={!form.formState.isDirty || form.formState.isSubmitting}>
							Edit Transaction
						</Button>
					</div>
				</form>
			</Form>
		</CardContent>
	);
}
