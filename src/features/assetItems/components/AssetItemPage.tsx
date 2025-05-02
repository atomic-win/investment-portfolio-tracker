'use client';

import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import AssetItem from '@/features/assetItems/components/AssetItem';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import withCurrency from '@/components/hoc/withCurrency';
import { AssetItemPortfolio } from '@/types';

export default function AssetItemPage({
	assetItemId,
}: {
	assetItemId: string;
}) {
	const WithLoadedAssetItemWrapper = withAssetItems(
		withCurrency(withAssetItemPortfolios(AssetItemWrapper))
	);

	return (
		<WithLoadedAssetItemWrapper assetItemIds={[assetItemId]} latest={true} />
	);
}

function AssetItemWrapper({
	portfolios,
}: {
	portfolios: AssetItemPortfolio[];
}) {
	const assetItem = portfolios[0];

	return (
		<>
			<title>{assetItem.name}</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{ title: assetItem.name, href: `/assetitems/${assetItem.id}` },
				]}
			/>
			<div className='container mx-auto p-2'>
				<AssetItem assetItem={assetItem} />
			</div>
		</>
	);
}
