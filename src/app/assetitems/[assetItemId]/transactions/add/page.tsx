'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import AddTransactionForm from '@/features/assetItems/components/AddTransactionForm';
import { withAssetPortfolios } from '@/features/portfolio/hoc/withAssetPortfolios';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import withCurrency from '@/features/components/hoc/withCurrency';
import withTransactions from '@/features/components/hoc/withTransactions';
import { AssetItemPortfolio } from '@/features/lib/types';

export default function Page({ params }: { params: { assetItemId: string } }) {
	const assetId = params.assetItemId;

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
