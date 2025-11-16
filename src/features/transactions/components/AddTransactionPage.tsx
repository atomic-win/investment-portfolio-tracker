'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import { withAssetItemPortfolio } from '@/features/portfolio/hoc/withAssetItemPortfolio';
import AddTransactionForm from '@/features/transactions/components/AddTransactionForm';
import { AssetItemPortfolio } from '@/types';

export default function Page({ assetItemId }: { assetItemId: string }) {
	const WrappedComponent = withAssetItemPortfolio(PageComponent);
	return <WrappedComponent assetItemId={assetItemId} />;
}

function PageComponent({ assetItem }: { assetItem: AssetItemPortfolio }) {
	return (
		<>
			<title>Add Transaction</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{ title: assetItem.name, href: `/assetitems/${assetItem.id}` },
					{
						title: 'Add Transaction',
						href: `/assetitems/${assetItem.id}/transactions/add`,
					},
				]}
			/>
			<div className='container mx-auto p-2 h-full'>
				<Card className='p-8 max-w-screen-sm mx-auto'>
					<AddTransactionForm assetItem={assetItem} />
				</Card>
			</div>
		</>
	);
}
