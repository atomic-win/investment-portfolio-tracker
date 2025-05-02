'use client';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { PortfolioPageContainer } from '@/features/portfolio/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/assetItems/components/InvestmentsFilterForm';
import {
	AssetItemPortfolio,
	AssetTypePortfolio,
	AssetClassPortfolio,
	OverallPortfolio,
} from '@/types';
import withPortfolioTrendsSection from '@/features/portfolio/hoc/withPortfolioTrendsSection';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { AssetClass, AssetType } from '@/types';
import { displayAssetClassText, displayAssetTypeText } from '@/lib/utils';
import withInvestmentsFilter from '@/features/portfolio/hoc/withInvestmentsFilter';

export default function Page() {
	const PortfolioTrendsOverallSection =
		withPortfolioTrendsSection<OverallPortfolio>({
			labelFn: () => 'Overall',
		});

	const PortfolioTrendsPerAssetClassSection =
		withPortfolioTrendsSection<AssetClassPortfolio>({
			labelFn: (portfolio) => displayAssetClassText(portfolio.id as AssetClass),
		});

	const PortfolioTrendsPerAssetTypeSection =
		withPortfolioTrendsSection<AssetTypePortfolio>({
			labelFn: (portfolio) => displayAssetTypeText(portfolio.id as AssetType),
		});

	const PortfolioTrendsPerAssetItemSection =
		withPortfolioTrendsSection<AssetItemPortfolio>({
			labelFn: (portfolio) => portfolio.name,
		});

	const WithLoadedPortfolioPageContainer = withAssetItems(
		withInvestmentsFilter(PortfolioPageContainer)
	);

	const WithLoadedInvestmentsFilterForm = withAssetItems(InvestmentsFilterForm);

	return (
		<>
			<title>Portfolio Trends</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Portfolio Trends', href: '/portfolio-trends' }]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolioPageContainer
							latest={false}
							OverallSection={PortfolioTrendsOverallSection}
							AssetClassSection={PortfolioTrendsPerAssetClassSection}
							AssetTypeSection={PortfolioTrendsPerAssetTypeSection}
							AssetItemSection={PortfolioTrendsPerAssetItemSection}
						/>
					</div>
					<div className='col-span-1'>
						<WithLoadedInvestmentsFilterForm />
					</div>
				</div>
			</div>
		</>
	);
}
