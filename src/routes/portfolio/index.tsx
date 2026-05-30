import { createFileRoute } from "@tanstack/react-router";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import withAssetItems from "@/features/asset-items/hoc/with-asset-items";
import InvestmentsFilterForm from "@/features/portfolio/components/investments-filter-form";
import PortfolioOverallSection from "@/features/portfolio/components/portfolio-overall-section";
import PortfolioPageContainer from "@/features/portfolio/components/portfolio-page-container";
import PortfolioPerAssetClassSection from "@/features/portfolio/components/portfolio-per-asset-class-section";
import PortfolioPerAssetItemSection from "@/features/portfolio/components/portfolio-per-asset-item-section";
import PortfolioPerAssetTypeSection from "@/features/portfolio/components/portfolio-per-asset-type-section";
import withInvestmentsFilter from "@/features/portfolio/hoc/with-investments-filter";

export const Route = createFileRoute("/portfolio/")({
	head: () => ({
		meta: [{ title: "Portfolio" }],
	}),
	component: PortfolioPage,
});

function PortfolioPage() {
	const WithLoadedPortfolioPageContainer = withAssetItems(
		withInvestmentsFilter(PortfolioPageContainer),
	);
	const WithLoadedInvestmentsFilterForm = withAssetItems(InvestmentsFilterForm);

	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[{ title: "Portfolio", href: "/portfolio" }]}
			/>
			<div className="container mx-auto p-2">
				<div className="grid grid-cols-3 gap-4">
					<div className="col-span-2">
						<WithLoadedPortfolioPageContainer
							latest={true}
							OverallSection={PortfolioOverallSection}
							AssetClassSection={PortfolioPerAssetClassSection}
							AssetTypeSection={PortfolioPerAssetTypeSection}
							AssetItemSection={PortfolioPerAssetItemSection}
						/>
					</div>
					<div className="col-span-1">
						<WithLoadedInvestmentsFilterForm />
					</div>
				</div>
			</div>
		</>
	);
}
