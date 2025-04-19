'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import AddTransactionForm from '@/features/assetItems/components/AddTransactionForm';
import { withAssetPortfolios } from '@/features/portfolio/hoc/withAssetPortfolios';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import withCurrency from '@/components/hoc/withCurrency';
import withTransactions from '@/features/components/hoc/withTransactions';
import { AssetItemPortfolio } from '@/features/lib/types';

export default function Page({ params }: { params: { assetId: string } }) {
	const assetId = params.assetId;

	const WithAddTransactionFormWrapper = withAssetItems(
		withCurrency(
			withTransactions(withAssetPortfolios(AddTransactionFormWrapper))
		)
	);

	return (
		<WithAddTransactionFormWrapper assetItemIds={[assetId]} latest={true} />
	);
}

function AddTransactionFormWrapper({
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
								title: assetItem.assetName,
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
