'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import Asset from '@/features/components/Asset';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withAssets from '@/features/components/hoc/withAssets';
import withCurrency from '@/features/components/hoc/withCurrency';
import withInstruments from '@/features/components/hoc/withInstruments';
import withTransactions from '@/features/components/hoc/withTransactions';
import { AssetItemPortfolio, Transaction } from '@/features/lib/types';

export default function Page({ params }: { params: { assetId: string } }) {
	const assetId = params.assetId;

	const WithLoadedAssetWrapper = withAssets(
		withInstruments(
			withCurrency(withTransactions(withAssetPortfolios(AssetWrapper)))
		)
	);

	return <WithLoadedAssetWrapper assetIds={[assetId]} latest={true} />;
}

function AssetWrapper({
	portfolios,
	transactions,
}: {
	portfolios: AssetItemPortfolio[];
	transactions: Transaction[];
}) {
	const asset = portfolios[0];

	return (
		<>
			<title>{asset.assetName}</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Assets', href: '/assets' },
					{ title: asset.assetName, href: `/assets/${asset.id}` },
				]}
			/>
			<div className='container mx-auto p-2'>
				<Asset asset={asset} transactions={transactions} />
			</div>
		</>
	);
}
