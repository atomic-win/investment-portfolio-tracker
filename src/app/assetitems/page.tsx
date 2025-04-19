'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import AssetItemsTable from '@/features/assetItems/components/AssetItemsTable';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withAssets from '@/features/components/hoc/withAssets';
import withCurrency from '@/features/components/hoc/withCurrency';

export default function Page() {
	const WithLoadedAssetsTable = withAssets(
		withCurrency(withAssetPortfolios(AssetItemsTable))
	);

	return (
		<>
			<title>Assets</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Asset Items', href: '/assetitems' }]}
			/>
			<div className='container mx-auto p-2'>
				<Card className='mx-auto rounded-lg shadow-md w-full p-2'>
					<CardContent className='p-6'>
						<WithLoadedAssetsTable
							assetIds={[]}
							latest={true}
							transactions={[]}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
