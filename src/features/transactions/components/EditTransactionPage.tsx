'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import { AssetItemPortfolio } from '@/types';
import EditTransactionForm from './EditTransactionForm';
import { withAssetItemPortfolio } from '@/features/portfolio/hoc/withAssetItemPortfolio';

export default function Page({
	assetItemId,
	transactionId,
}: {
	assetItemId: string;
	transactionId: string;
}) {
	const WrappedComponent = withAssetItemPortfolio(PageComponent);

	return (
		<WrappedComponent assetItemId={assetItemId} transactionId={transactionId} />
	);
}

function PageComponent({
	assetItem,
	transactionId,
}: {
	assetItem: AssetItemPortfolio;
	transactionId: string;
}) {
	return (
		<>
			<title>Edit Transaction</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{ title: assetItem.name, href: `/assetitems/${assetItem.id}` },
					{
						title: 'Edit Transaction',
						href: `/assetitems/${assetItem.id}/transactions/${transactionId}/edit`,
					},
				]}
			/>
			<div className='container mx-auto p-2 h-full'>
				<Card className='p-8 max-w-screen-sm mx-auto'>
					<EditTransactionForm
						assetItem={assetItem}
						transactionId={transactionId}
					/>
				</Card>
			</div>
		</>
	);
}
