'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import InvestmentsFilterForm from '@/features/portfolio/components/InvestmentsFilterForm';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import PortfolioPageContainer from '@/features/portfolio/components/PortfolioPageContainer';
import withInvestmentsFilter from '@/features/portfolio/hoc/withInvestmentsFilter';
import withPortfolioTrendsSection from '@/features/portfolio/hoc/withPortfolioTrendsSection';
import { displayAssetClassText, displayAssetTypeText } from '@/lib/utils';
import {
	AssetItemPortfolio,
	AssetTypePortfolio,
	AssetClassPortfolio,
	OverallPortfolio,
	PortfolioType,
	AssetClass,
	AssetType,
} from '@/types';

export default function Page() {
	const PortfolioTrendsOverallSection =
		withPortfolioTrendsSection<OverallPortfolio>({
			portfolioType: PortfolioType.Overall,
			labelFn: () => 'Overall',
			showTotalInTooltip: false,
		});

	const PortfolioTrendsPerAssetClassSection =
		withPortfolioTrendsSection<AssetClassPortfolio>({
			portfolioType: PortfolioType.PerAssetClass,
			labelFn: (portfolio) =>
				displayAssetClassText(portfolio.id as AssetClass),
		});

	const PortfolioTrendsPerAssetTypeSection =
		withPortfolioTrendsSection<AssetTypePortfolio>({
			portfolioType: PortfolioType.PerAssetType,
			labelFn: (portfolio) =>
				displayAssetTypeText(portfolio.id as AssetType),
		});

	const PortfolioTrendsPerAssetItemSection =
		withPortfolioTrendsSection<AssetItemPortfolio>({
			portfolioType: PortfolioType.PerAssetItem,
			labelFn: (portfolio) => portfolio.name,
		});

	const WithLoadedPortfolioPageContainer = withAssetItems(
		withInvestmentsFilter(PortfolioPageContainer)
	);

	const WithLoadedInvestmentsFilterForm = withAssetItems(
		InvestmentsFilterForm
	);

	return (
		<>
			<title>Portfolio Trends</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Portfolio Trends', href: '/portfolio-trends' },
				]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolioPageContainer
							latest={false}
							OverallSection={PortfolioTrendsOverallSection}
							AssetClassSection={
								PortfolioTrendsPerAssetClassSection
							}
							AssetTypeSection={
								PortfolioTrendsPerAssetTypeSection
							}
							AssetItemSection={
								PortfolioTrendsPerAssetItemSection
							}
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
