'use client';

import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import AssetItem from '@/features/assetItems/components/AssetItem';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import withCurrency from '@/components/hoc/withCurrency';
import withTransactions from '@/features/assetItems/hoc/withTransactions';
import { AssetItemPortfolio, Transaction } from '@/types';

export default function AssetItemPage({
	assetItemId,
}: {
	assetItemId: string;
}) {
	const WithLoadedAssetItemWrapper = withAssetItems(
		withCurrency(withTransactions(withAssetItemPortfolios(AssetItemWrapper)))
	);

	return (
		<WithLoadedAssetItemWrapper assetItemIds={[assetItemId]} latest={true} />
	);
}

function AssetItemWrapper({
	portfolios,
	transactions,
}: {
	portfolios: AssetItemPortfolio[];
	transactions: Transaction[];
}) {
	const assetItem = portfolios[0];

	return (
		<>
			<title>{assetItem.assetName}</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{ title: assetItem.assetName, href: `/assetitems/${assetItem.id}` },
				]}
			/>
			<div className='container mx-auto p-2'>
				<AssetItem assetItem={assetItem} transactions={transactions} />
			</div>
		</>
	);
}
