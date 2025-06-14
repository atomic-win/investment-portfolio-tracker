import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { AssetItem , AssetClass, AssetType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontalIcon } from 'lucide-react';
import { displayAssetClassText, displayAssetTypeText } from '@/lib/utils';

const schema = z.object({
	assetClasses: z.array(z.nativeEnum(AssetClass)),
	assetTypes: z.array(z.nativeEnum(AssetType)),
	assetItemIds: z.array(z.string()),
});

export default function InvestmentsFilterForm({
	assetItems,
}: {
	assetItems: AssetItem[];
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const filteredAssetClasses =
		(searchParams.getAll('assetClass') as AssetClass[]) || [];
	const filteredAssetTypes =
		(searchParams.getAll('assetType') as AssetType[]) || [];
	const filteredAssetItemIds = searchParams.getAll('assetItemId') || [];

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			assetClasses: filteredAssetClasses,
			assetTypes: filteredAssetTypes,
			assetItemIds: filteredAssetItemIds,
		},
	});

	function onCheckedChange(data: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams);

		params.delete('assetClass');
		params.delete('assetType');
		params.delete('assetItemId');

		if (data.assetClasses.length > 0) {
			for (const assetClass of data.assetClasses) {
				params.append('assetClass', assetClass);
			}
		}

		if (data.assetTypes.length > 0) {
			for (const assetType of data.assetTypes) {
				params.append('assetType', assetType);
			}
		}

		if (data.assetItemIds.length > 0) {
			for (const assetItemId of data.assetItemIds) {
				params.append('assetItemId', assetItemId);
			}
		}

		replace(`${pathname}?${params.toString()}`);
	}

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md'>
			<CardHeader className='flex items-center gap-4 space-y-0 border-b py-2 pt-4 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2'>
					<CardTitle>
						<div className='flex items-center '>
							<SlidersHorizontalIcon className='h-4 w-4' />
							<span className='ml-2'>Filters</span>
						</div>
					</CardTitle>
					<CardDescription>
						Apply filters for portfolio calculation
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-4'>
				<Form {...form}>
					<form onSubmit={() => {}} className='space-y-6'>
						<FormField
							control={form.control}
							name='assetClasses'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Asset Class</FormLabel>
										<FormDescription>
											Select the Asset Classes for portfolio calculation
										</FormDescription>
									</div>
									{Object.values(AssetClass).map((assetClass) => (
										<FormField
											key={assetClass}
											control={form.control}
											name='assetClasses'
											render={({ field }) => {
												return (
													<div className='py-0.5'>
														<FormItem
															key={assetClass}
															className='flex flex-row items-start space-x-3 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(assetClass)}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			field.onChange([
																				...field.value,
																				assetClass,
																			]);
																		} else {
																			field.onChange(
																				field.value?.filter(
																					(value) => value !== assetClass
																				)
																			);
																		}

																		form.handleSubmit(onCheckedChange)();
																	}}
																	disabled={
																		!assetItems.some(
																			(x) => x.assetClass === assetClass
																		)
																	}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{displayAssetClassText(assetClass)}
															</FormLabel>
														</FormItem>
													</div>
												);
											}}
										/>
									))}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='assetTypes'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Asset Types</FormLabel>
										<FormDescription>
											Select the Asset Types for portfolio calculation
										</FormDescription>
									</div>
									{Object.values(AssetType).map((assetType) => (
										<FormField
											key={assetType}
											control={form.control}
											name='assetTypes'
											render={({ field }) => {
												return (
													<div className='py-0.5'>
														<FormItem
															key={assetType}
															className='flex flex-row items-start space-x-3 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(assetType)}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			field.onChange([
																				...field.value,
																				assetType,
																			]);
																		} else {
																			field.onChange(
																				field.value?.filter(
																					(value) => value !== assetType
																				)
																			);
																		}

																		form.handleSubmit(onCheckedChange)();
																	}}
																	disabled={
																		!assetItems.some(
																			(x) => x.assetType === assetType
																		) ||
																		(filteredAssetClasses.length !== 0 &&
																			!assetItems
																				.filter((x) =>
																					filteredAssetClasses.includes(
																						x.assetClass
																					)
																				)
																				.map((x) => x.assetType)
																				.includes(assetType))
																	}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{displayAssetTypeText(assetType)}
															</FormLabel>
														</FormItem>
													</div>
												);
											}}
										/>
									))}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='assetItemIds'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Asset Items</FormLabel>
										<FormDescription>
											Select the Asset Items for portfolio calculation
										</FormDescription>
									</div>
									{assetItems.map((assetItem) => (
										<FormField
											key={assetItem.id}
											control={form.control}
											name='assetItemIds'
											render={({ field }) => {
												return (
													<div className='py-0.5'>
														<FormItem
															key={assetItem.id}
															className='flex flex-row items-start space-x-3 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(assetItem.id)}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			field.onChange([
																				...field.value,
																				assetItem.id,
																			]);
																		} else {
																			field.onChange(
																				field.value?.filter(
																					(value) => value !== assetItem.id
																				)
																			);
																		}

																		form.handleSubmit(onCheckedChange)();
																	}}
																	disabled={
																		(filteredAssetClasses.length !== 0 &&
																			!filteredAssetClasses.includes(
																				assetItem.assetClass
																			)) ||
																		(filteredAssetTypes.length !== 0 &&
																			!filteredAssetTypes.includes(
																				assetItem.assetType
																			))
																	}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{assetItem.name}
															</FormLabel>
														</FormItem>
													</div>
												);
											}}
										/>
									))}
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
