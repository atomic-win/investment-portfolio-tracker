'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import AddTransactionForm from '@/features/components/forms/AddTransactionForm';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withAssets from '@/features/components/hoc/withAssets';
import withCurrency from '@/features/components/hoc/withCurrency';
import withInstruments from '@/features/components/hoc/withInstruments';
import withTransactions from '@/features/components/hoc/withTransactions';
import { AssetPortfolio } from '@/features/lib/types';

export default function Page({ params }: { params: { assetId: string } }) {
	const assetId = params.assetId;

	const WithAddTransactionFormWrapper = withAssets(
		withInstruments(
			withCurrency(
				withTransactions(withAssetPortfolios(AddTransactionFormWrapper))
			)
		)
	);

	return <WithAddTransactionFormWrapper assetIds={[assetId]} latest={true} />;
}

function AddTransactionFormWrapper({
	portfolios,
}: {
	portfolios: AssetPortfolio[];
}) {
	const asset = portfolios[0];

	return (
		<Modal>
			<DialogContent>
				<DialogHeader>
					<SidebarTriggerWithBreadcrumb
						breadcrumbs={[
							{ title: 'Assets', href: '/assets' },
							{
								title: asset.assetName,
								href: `/assets/${asset.id}`,
							},
							{
								title: 'Add Transaction',
								href: `/assets/${asset.id}/transactions/add`,
							},
						]}
					/>
				</DialogHeader>
				<div className='p-2'>
					<AddTransactionForm asset={asset} />
				</div>
			</DialogContent>
		</Modal>
	);
}
