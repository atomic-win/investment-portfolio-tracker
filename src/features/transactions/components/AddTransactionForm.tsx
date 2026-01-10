'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
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
	TransactionFormSchema,
	getApplicableTransactionTypes,
} from '@/features/assetItems/schema';
import { useAddTransactionMutation } from '@/features/transactions/hooks/transactions';
import {
	displayTransactionTypeText,
	getUnitLabelText,
	isAmountRequired,
} from '@/features/transactions/lib/utils';
import { AssetItemPortfolio, TransactionType } from '@/types';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';

export default function AddTransactionForm({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	const { mutateAsync: addTransactionAsync } = useAddTransactionMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof TransactionFormSchema>>({
		resolver: zodResolver(TransactionFormSchema),
		defaultValues: {
			date: new Date(),
			transactionType: getApplicableTransactionTypes(
				assetItem.assetType
			)[0],
			name: '',
			units: 0,
			price: 0,
			amount: 0,
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
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col space-y-4'
			>
				<FieldGroup>
					<Controller
						control={form.control}
						name='date'
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Transaction Date
								</FieldLabel>
								<DatePicker
									date={field.value}
									onSelect={field.onChange}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name='name'
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Transaction Name
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name='transactionType'
						render={({
							field: { onChange, ...field },
							fieldState,
						}) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Transaction Type
								</FieldLabel>
								<Select {...field} onValueChange={onChange}>
									<SelectTrigger
										className='w-full rounded-lg sm:ml-auto'
										aria-label='Select a value'
										aria-invalid={fieldState.invalid}
										id={field.name}
										onBlur={field.onBlur}
									>
										<SelectValue title='Select a transaction type'>
											{displayTransactionTypeText(
												field.value as TransactionType
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent className='rounded-xl'>
										{getApplicableTransactionTypes(
											assetItem.assetType
										).map((type) => (
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
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					{!isAmountRequired(form.watch('transactionType')) && (
						<>
							<Controller
								control={form.control}
								name='units'
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											{getUnitLabelText(
												assetItem,
												form.watch('transactionType')
											)}
										</FieldLabel>
										<Input
											{...field}
											type='number'
											id={field.name}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
											/>
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name='price'
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Price ({assetItem.currency})
										</FieldLabel>
										<Input
											{...field}
											type='number'
											id={field.name}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError
												errors={[fieldState.error]}
											/>
										)}
									</Field>
								)}
							/>
						</>
					)}
					{isAmountRequired(form.watch('transactionType')) && (
						<Controller
							control={form.control}
							name='amount'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Amount ({assetItem.currency})
									</FieldLabel>
									<Input
										{...field}
										type='number'
										id={field.name}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					)}
					<div className='flex justify-end'>
						<Button type='submit' className='cursor-pointer'>
							Add Transaction
						</Button>
					</div>
				</FieldGroup>
			</form>
		</CardContent>
	);
}
