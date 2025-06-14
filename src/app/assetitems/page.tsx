'use client';
import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';

import withCurrency from '@/components/hoc/withCurrency';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AssetItemsTable from '@/features/assetItems/components/AssetItemsTable';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { refreshAssetItems } from '@/features/assetItems/hooks/assetItems';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';

export default function Page() {
	const queryClient = useQueryClient();

	const WithLoadedAssetItemsTable = withAssetItems(
		withCurrency(withAssetItemPortfolios(AssetItemsTable))
	);

	return (
		<>
			<title>Asset Items</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Asset Items', href: '/assetitems' }]}
			/>
			<div className='container mx-auto p-2'>
				<Card className='mx-auto rounded-lg shadow-md w-full p-2 gap-4'>
					<CardHeader className='border-b py-2'>
						<CardTitle className='text-3xl h-full'>Asset Items</CardTitle>
					</CardHeader>
					<CardContent className='px-6 pb-6'>
						<div className='flex justify-end text-xl font-semibold items-center mb-2 gap-x-2'>
							<Link href={'/assetitems/add'}>
								<Button className='cursor-pointer'>
									<PlusIcon />
									Add Asset Item
								</Button>
							</Link>
							<Button
								className='cursor-pointer'
								onClick={async () => await refreshAssetItems(queryClient)}>
								<RefreshCwIcon />
								Refresh
							</Button>
						</div>
						<WithLoadedAssetItemsTable assetItemIds={[]} latest={true} />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
