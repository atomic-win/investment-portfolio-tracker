'use client';
import withAssets from '@/features/components/hoc/withAssets';
import withPortfolios from '@/features/components/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/components/InvestmentsFilterForm';
import {
	AssetItemPortfolio,
	AssetTypePortfolio,
	AssetClassPortfolio,
	OverallPortfolio,
} from '@/features/lib/types';
import withPortfolioTrendsSection from '@/features/components/hoc/withPortfolioTrendsSection';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { AssetClass, AssetType } from '@/types';

export default function Page() {
	const PortfolioTrendsOverallSection =
		withPortfolioTrendsSection<OverallPortfolio>({
			labelFn: () => 'Overall',
		});

	const PortfolioTrendsPerAssetClassSection =
		withPortfolioTrendsSection<AssetClassPortfolio>({
			labelFn: (portfolio) => portfolio.id as AssetClass,
		});

	const PortfolioTrendsPerAssetTypeSection =
		withPortfolioTrendsSection<AssetTypePortfolio>({
			labelFn: (portfolio) => portfolio.id as AssetType,
		});

	const PortfolioTrendsPerAssetSection =
		withPortfolioTrendsSection<AssetItemPortfolio>({
			labelFn: (portfolio) => portfolio.assetName,
		});

	const WithLoadedPortfolio = withPortfolios(
		PortfolioTrendsOverallSection,
		PortfolioTrendsPerAssetClassSection,
		PortfolioTrendsPerAssetTypeSection,
		PortfolioTrendsPerAssetSection
	);

	const WithLoadedInvestmentsFilterForm = withAssets(InvestmentsFilterForm);

	return (
		<>
			<title>Portfolio Trends</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Portfolio Trends', href: '/portfolio-trends' }]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolio latest={false} />
					</div>
					<div className='col-span-1'>
						<WithLoadedInvestmentsFilterForm />
					</div>
				</div>
			</div>
		</>
	);
}
