'use client';
import withCurrency from '@/components/hoc/withCurrency';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import EditTransactionForm from '@/features/transactions/components/EditTransactionForm';
import { AssetItemPortfolio } from '@/types';

export default function EditTransactionModalWrapper({
	assetItemId,
	transactionId,
}: {
	assetItemId: string;
	transactionId: string;
}) {
	const WithEditTransactionFormWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(EditTransactionModal))
	);

	return (
		<WithEditTransactionFormWrapper
			assetItemIds={[assetItemId]}
			transactionId={transactionId}
			latest={true}
		/>
	);
}

function EditTransactionModal({
	portfolios,
	transactionId,
}: {
	portfolios: AssetItemPortfolio[];
	transactionId: string;
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
