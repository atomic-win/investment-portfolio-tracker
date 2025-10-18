'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import { withAssetItemPortfolio } from '@/features/portfolio/hoc/withAssetItemPortfolio';
import AddTransactionForm from '@/features/transactions/components/AddTransactionForm';
import { AssetItemPortfolio } from '@/types';

export default function Page({ assetItemId }: { assetItemId: string }) {
	const WrappedComponent = withAssetItemPortfolio(PageComponent);
	return <WrappedComponent assetItemId={assetItemId} />;
}

function PageComponent({ assetItem }: { assetItem: AssetItemPortfolio }) {
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
								title: 'Add Transaction',
								href: `/assetitems/${assetItem.id}/transactions/add`,
							},
						]}
					/>
				</DialogHeader>
				<div className='p-2'>
					<AddTransactionForm assetItem={assetItem} />
				</div>
			</DialogContent>
		</Modal>
	);
}
