'use client';

import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import AssetItem from '@/features/assetItems/components/AssetItem';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withAssets from '@/features/components/hoc/withAssets';
import withCurrency from '@/features/components/hoc/withCurrency';
import withTransactions from '@/features/components/hoc/withTransactions';
import { AssetItemPortfolio, Transaction } from '@/features/lib/types';

export default function AssetItemPage({
	assetItemId,
}: {
	assetItemId: string;
}) {
	const WithLoadedAssetWrapper = withAssets(
		withCurrency(withTransactions(withAssetPortfolios(AssetWrapper)))
	);

	return <WithLoadedAssetWrapper assetIds={[assetItemId]} latest={true} />;
}

function AssetWrapper({
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
