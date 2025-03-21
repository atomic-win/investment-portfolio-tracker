'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import withAssets from '@/features/components/hoc/withAssets';
import withInstruments from '@/features/components/hoc/withInstruments';
import withPortfolios from '@/features/components/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/components/InvestmentsFilterForm';
import PortfolioOverallSection from '@/features/components/PortfolioOverallSection';
import PortfolioPerAssetSection from '@/features/components/PortfolioPerAssetSection';
import PortfolioPerInstrumentSection from '@/features/components/PortfolioPerInstrumentSection';
import PortfolioPerInstrumentTypeSection from '@/features/components/PortfolioPerInstrumentTypeSection';

export default function Page() {
	const WithLoadedPortfolio = withPortfolios(
		PortfolioOverallSection,
		PortfolioPerInstrumentTypeSection,
		PortfolioPerInstrumentSection,
		PortfolioPerAssetSection
	);

	const WithLoadedInvestmentsFilterForm = withAssets(
		withInstruments(InvestmentsFilterForm)
	);

	return (
		<>
			<title>Portfolio</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Investments', href: '#' },
					{ title: 'Portfolio', href: '/investments/portfolio' },
				]}
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
