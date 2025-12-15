import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	Form,
} from '@/components/ui/form';
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

export default function AddAssetItemForm() {
	const { mutateAsync: addAssetItemAsync } = useAddAssetItemMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof AddAssetItemSchema>>({
		resolver: zodResolver(AddAssetItemSchema),
		defaultValues: {
			name: '',
			type: AssetType.BankAccount,
		},
	});

	async function onSubmit(data: AddAssetItemRequest) {
		await addAssetItemAsync(data);
		router.back();
	}

	const assetType = form.watch('type');

	return (
		<CardContent className='p-0'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col space-y-4'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Asset Item Name</FormLabel>
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
								<FormLabel>Asset Item Type</FormLabel>
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
											{Object.values(AssetType).map(
												(type) => (
													<SelectItem
														key={type}
														value={type}
														className='rounded-lg'
													>
														{displayAssetTypeText(
															type
														)}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{isAssetClassInputSupported(assetType) && (
						<FormField
							control={form.control}
							name='assetClass'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Asset Class</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger
												className='w-full rounded-lg sm:ml-auto'
												aria-label='Select a value'
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
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{isSchemeCodeInputSupported(assetType) && (
						<FormField
							control={form.control}
							name='schemeCode'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Scheme Code</FormLabel>
									<FormControl>
										<Input
											type='number'
											min={100000}
											max={999999}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Scheme code is a 6-digit number for
										mutual funds.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{isSymbolInputSupported(assetType) && (
						<FormField
							control={form.control}
							name='symbol'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Symbol</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Symbol is the stock symbol for the
										asset.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{isCurrencyInputSupported(assetType) && (
						<FormField
							control={form.control}
							name='currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Currency</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger
												className='w-full rounded-lg sm:ml-auto'
												aria-label='Select a value'
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
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<div className='flex justify-end'>
						<Button type='submit' className='cursor-pointer'>
							Add Asset Item
						</Button>
					</div>
				</form>
			</Form>
		</CardContent>
	);
}
