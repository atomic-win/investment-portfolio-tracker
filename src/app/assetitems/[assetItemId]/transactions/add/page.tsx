'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import AddTransactionForm from '@/features/transactions/components/AddTransactionForm';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import withCurrency from '@/components/hoc/withCurrency';
import { AssetItemPortfolio } from '@/types';

export default function Page({ params }: { params: { assetItemId: string } }) {
	const assetItemId = params.assetItemId;

	const WithAddTransactionFormWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(AddTransactionFormWrapper))
	);

	return (
		<WithAddTransactionFormWrapper assetItemIds={[assetItemId]} latest={true} />
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
					{ title: assetItem.name, href: `/assetitems/${assetItem.id}` },
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
