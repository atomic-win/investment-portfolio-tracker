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
import { AssetItem } from '@/features/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontalIcon } from 'lucide-react';
import { AssetClass, AssetType } from '@/types';

const schema = z.object({
	assetClasses: z.array(z.nativeEnum(AssetClass)),
	assetTypes: z.array(z.nativeEnum(AssetType)),
	assetIds: z.array(z.string()),
});

export default function InvestmentsFilterForm({
	assets,
}: {
	assets: AssetItem[];
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const filteredAssetClasses =
		(searchParams.getAll('assetClass') as AssetClass[]) || [];
	const filteredAssetTypes =
		(searchParams.getAll('assetType') as AssetType[]) || [];
	const filteredAssetIds = searchParams.getAll('assetIds') || [];

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			assetClasses: filteredAssetClasses,
			assetTypes: filteredAssetTypes,
			assetIds: filteredAssetIds,
		},
	});

	function onCheckedChange(data: z.infer<typeof schema>) {
		const params = new URLSearchParams(searchParams);

		params.delete('assetClass');
		params.delete('assetType');
		params.delete('assetIds');

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

		if (data.assetIds.length > 0) {
			for (const assetId of data.assetIds) {
				params.append('assetIds', assetId);
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
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{assetClass}
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
																		filteredAssetClasses.length !== 0 &&
																		!assets
																			.filter((x) =>
																				filteredAssetClasses.includes(
																					x.assetClass
																				)
																			)
																			.map((x) => x.assetType)
																			.includes(assetType)
																	}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{assetType}
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
							name='assetIds'
							render={() => (
								<FormItem>
									<div>
										<FormLabel className='text-base'>Assets</FormLabel>
										<FormDescription>
											Select the assets for portfolio calculation
										</FormDescription>
									</div>
									{assets.map((asset) => (
										<FormField
											key={asset.id}
											control={form.control}
											name='assetIds'
											render={({ field }) => {
												return (
													<div className='py-0.5'>
														<FormItem
															key={asset.id}
															className='flex flex-row items-start space-x-3 space-y-0'>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(asset.id)}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			field.onChange([
																				...field.value,
																				asset.id,
																			]);
																		} else {
																			field.onChange(
																				field.value?.filter(
																					(value) => value !== asset.id
																				)
																			);
																		}

																		form.handleSubmit(onCheckedChange)();
																	}}
																	disabled={
																		(filteredAssetClasses.length !== 0 &&
																			!filteredAssetClasses.includes(
																				asset.assetClass
																			)) ||
																		(filteredAssetTypes.length !== 0 &&
																			!filteredAssetTypes.includes(
																				asset.assetType
																			))
																	}
																/>
															</FormControl>
															<FormLabel className='font-normal'>
																{asset.name}
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
