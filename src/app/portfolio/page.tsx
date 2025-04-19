'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import withAssets from '@/features/components/hoc/withAssets';
import withPortfolios from '@/features/components/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/assetItems/components/InvestmentsFilterForm';
import PortfolioOverallSection from '@/features/components/PortfolioOverallSection';
import PortfolioPerAssetSection from '@/features/components/PortfolioPerAssetSection';
import PortfolioPerAssetTypeSection from '@/features/components/PortfolioPerAssetTypeSection';
import PortfolioPerAssetClassSection from '@/features/components/PortfolioPerAssetClassSection';

export default function Page() {
	const WithLoadedPortfolio = withPortfolios(
		PortfolioOverallSection,
		PortfolioPerAssetClassSection,
		PortfolioPerAssetTypeSection,
		PortfolioPerAssetSection
	);

	const WithLoadedInvestmentsFilterForm = withAssets(InvestmentsFilterForm);

	return (
		<>
			<title>Portfolio</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Portfolio', href: '/investments/portfolio' }]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolio latest={true} />
					</div>
					<div className='col-span-1'>
						<WithLoadedInvestmentsFilterForm />
					</div>
				</div>
			</div>
		</>
	);
}
