'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import AssetsTable from '@/features/components/AssetsTable';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withAssets from '@/features/components/hoc/withAssets';
import withCurrency from '@/features/components/hoc/withCurrency';

export default function Page() {
	const WithLoadedAssetsTable = withAssets(
		withCurrency(withAssetPortfolios(AssetsTable))
	);

	return (
		<>
			<title>Assets</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Assets', href: '/assets' }]}
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
