'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import AddTransactionForm from '@/features/assetItems/components/AddTransactionForm';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withAssets from '@/features/components/hoc/withAssets';
import withCurrency from '@/features/components/hoc/withCurrency';
import withTransactions from '@/features/components/hoc/withTransactions';
import { AssetItemPortfolio } from '@/features/lib/types';

export default function Page({ params }: { params: { assetItemId: string } }) {
	const assetId = params.assetItemId;

	const WithAddTransactionFormWrapper = withAssets(
		withCurrency(
			withTransactions(withAssetPortfolios(AddTransactionFormWrapper))
		)
	);

	return <WithAddTransactionFormWrapper assetIds={[assetId]} latest={true} />;
}

function AddTransactionFormWrapper({
	portfolios,
}: {
	portfolios: AssetItemPortfolio[];
}) {
	const assetItem = portfolios[0];

	return (
		<>
			<title>Add Transaction</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{ title: assetItem.assetName, href: `/assetitems/${assetItem.id}` },
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
