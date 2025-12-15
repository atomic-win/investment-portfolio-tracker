import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAddAssetItemMutation } from '@/features/assetItems/hooks/assetItems';
import {
	AddAssetItemRequest,
	AddAssetItemSchema,
	getApplicableAssetClasses,
	isAssetClassInputSupported,
	isCurrencyInputSupported,
	isSchemeCodeInputSupported,
	isSymbolInputSupported,
} from '@/features/assetItems/schema';
import { displayAssetClassText, displayAssetTypeText } from '@/lib/utils';
import { AssetType, Currency } from '@/types';
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
	FieldDescription,
} from '@/components/ui/field';

export default function AddAssetItemForm() {
	const { mutateAsync: addAssetItemAsync } = useAddAssetItemMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof AddAssetItemSchema>>({
		resolver: zodResolver(AddAssetItemSchema),
		defaultValues: {
			name: '',
			assetType: AssetType.BankAccount,
		},
	});

	async function onSubmit(data: AddAssetItemRequest) {
		await addAssetItemAsync(data);
		router.back();
	}

	const assetType = form.watch('assetType');

	return (
		<CardContent className='p-0'>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col'
			>
				<FieldGroup>
					<Controller
						control={form.control}
						name='name'
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Asset Item Name
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
						name='assetType'
						render={({
							field: { onChange, ...field },
							fieldState,
						}) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Asset Item Type
								</FieldLabel>
								<Select {...field} onValueChange={onChange}>
									<SelectTrigger
										className='w-full rounded-lg sm:ml-auto'
										aria-label='Select a value'
										aria-invalid={fieldState.invalid}
										id={field.name}
										onBlur={field.onBlur}
									>
										<SelectValue title='Select a transaction type' />
									</SelectTrigger>
									<SelectContent className='rounded-xl'>
										{Object.values(AssetType).map(
											(type) => (
												<SelectItem
													key={type}
													value={type}
													className='rounded-lg'
												>
													{displayAssetTypeText(type)}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					{isAssetClassInputSupported(assetType) && (
						<Controller
							control={form.control}
							name='assetClass'
							render={({
								field: { onChange, ...field },
								fieldState,
							}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Asset Class
									</FieldLabel>
									<Select {...field} onValueChange={onChange}>
										<SelectTrigger
											className='w-full rounded-lg sm:ml-auto'
											aria-label='Select a value'
											aria-invalid={fieldState.invalid}
											id={field.name}
											onBlur={field.onBlur}
										>
											<SelectValue title='Select an asset class' />
										</SelectTrigger>
										<SelectContent className='rounded-xl'>
											{getApplicableAssetClasses(
												assetType
											).map((assetClass) => (
												<SelectItem
													key={assetClass}
													value={assetClass}
													className='rounded-lg'
												>
													{displayAssetClassText(
														assetClass
													)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{}
								</Field>
							)}
						/>
					)}
					{isSchemeCodeInputSupported(assetType) && (
						<Controller
							control={form.control}
							name='schemeCode'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Scheme Code
									</FieldLabel>
									<Input
										type='number'
										min={100000}
										max={999999}
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
									/>
									<FieldDescription>
										Scheme code is a 6-digit number for
										mutual funds.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					)}
					{isSymbolInputSupported(assetType) && (
						<Controller
							control={form.control}
							name='symbol'
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Symbol
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
									/>
									<FieldDescription>
										Symbol is the stock symbol for the
										asset.
									</FieldDescription>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					)}
					{isCurrencyInputSupported(assetType) && (
						<Controller
							control={form.control}
							name='currency'
							render={({
								field: { onChange, ...field },
								fieldState,
							}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>
										Currency
									</FieldLabel>
									<Select {...field} onValueChange={onChange}>
										<SelectTrigger
											className='w-full rounded-lg sm:ml-auto'
											aria-label='Select a value'
											aria-invalid={fieldState.invalid}
											id={field.name}
											onBlur={field.onBlur}
										>
											<SelectValue title='Select a currency' />
										</SelectTrigger>
										<SelectContent className='rounded-xl'>
											{Object.values(Currency)
												.filter(
													(currency) =>
														currency !==
														Currency.Unknown
												)
												.sort((a, b) =>
													a.localeCompare(b)
												)
												.map((currency) => (
													<SelectItem
														key={currency}
														value={currency}
														className='rounded-lg'
													>
														{currency}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
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
							Add Asset Item
						</Button>
					</div>
				</FieldGroup>
			</form>
		</CardContent>
	);
}
