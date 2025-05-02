'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { PortfolioPageContainer } from '@/features/portfolio/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/assetItems/components/InvestmentsFilterForm';
import PortfolioOverallSection from '@/features/portfolio/components/PortfolioOverallSection';
import PortfolioPerAssetItemSection from '@/features/portfolio/components/PortfolioPerAssetItemSection';
import PortfolioPerAssetTypeSection from '@/features/portfolio/components/PortfolioPerAssetTypeSection';
import PortfolioPerAssetClassSection from '@/features/portfolio/components/PortfolioPerAssetClassSection';
import withInvestmentsFilter from '@/features/portfolio/hoc/withInvestmentsFilter';

export default function Page() {
	const WithLoadedPortfolioPageContainer = withAssetItems(
		withInvestmentsFilter(PortfolioPageContainer)
	);

	const WithLoadedInvestmentsFilterForm = withAssetItems(InvestmentsFilterForm);

	return (
		<>
			<title>Portfolio</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: 'Portfolio', href: '/investments/portfolio' }]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolioPageContainer
							latest={true}
							OverallSection={PortfolioOverallSection}
							AssetClassSection={PortfolioPerAssetClassSection}
							AssetTypeSection={PortfolioPerAssetTypeSection}
							AssetItemSection={PortfolioPerAssetItemSection}
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
