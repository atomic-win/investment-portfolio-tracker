'use client';
import withCurrency from '@/components/hoc/withCurrency';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import AddTransactionForm from '@/features/transactions/components/AddTransactionForm';
import { AssetItemPortfolio } from '@/types';

export default function AddTransactionModalWrapper({
	assetItemId,
}: {
	assetItemId: string;
}) {
	const WithAddTransactionFormWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(AddTransactionModal))
	);

	return (
		<WithAddTransactionFormWrapper assetItemIds={[assetItemId]} latest={true} />
	);
}

function AddTransactionModal({
	portfolios,
}: {
	portfolios: AssetItemPortfolio[];
}) {
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
