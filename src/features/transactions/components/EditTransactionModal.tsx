'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import { withAssetItemPortfolio } from '@/features/portfolio/hoc/withAssetItemPortfolio';
import EditTransactionForm from '@/features/transactions/components/EditTransactionForm';
import { AssetItemPortfolio } from '@/types';

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
		<Modal>
			<DialogContent>
				<DialogHeader>
					<SidebarTriggerWithBreadcrumb
						breadcrumbs={[
							{ title: 'Asset Items', href: '/assetitems' },
							{
								title: assetItem.name,
								href: `/assetitems/${assetItem.id}`,
							},
							{
								title: 'Edit Transaction',
								href: `/assetitems/${assetItem.id}/transactions/${transactionId}/edit`,
							},
						]}
					/>
				</DialogHeader>
				<div className='p-2'>
					<EditTransactionForm
						assetItem={assetItem}
						transactionId={transactionId}
					/>
				</div>
			</DialogContent>
		</Modal>
	);
}
