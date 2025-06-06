'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import AddTransactionForm from '@/features/transactions/components/AddTransactionForm';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import withCurrency from '@/components/hoc/withCurrency';
import { AssetItemPortfolio } from '@/types';

export function AddTransactionModal({ assetItemId }: { assetItemId: string }) {
	const WithAddTransactionFormWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(ModalComponent))
	);

	return (
		<WithAddTransactionFormWrapper assetItemIds={[assetItemId]} latest={true} />
	);
}

function ModalComponent({ portfolios }: { portfolios: AssetItemPortfolio[] }) {
	const assetItem = portfolios[0];

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
