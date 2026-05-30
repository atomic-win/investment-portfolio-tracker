import { createFileRoute } from "@tanstack/react-router";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import { Card } from "@/components/ui/card";
import { withAssetItemPortfolio } from "@/features/portfolio/hoc/with-asset-item-portfolio";
import AddTransactionForm from "@/features/transactions/components/add-transaction-form";
import type { AssetItemPortfolio } from "@/types";

export const Route = createFileRoute(
	"/asset-items/$assetItemId/transactions/add",
)({
	component: AddTransactionRoute,
});

function AddTransactionRoute() {
	const { assetItemId } = Route.useParams();
	const WrappedComponent = withAssetItemPortfolio(AddTransactionContent);
	return <WrappedComponent assetItemId={assetItemId} />;
}

function AddTransactionContent({
	assetItem,
}: {
	assetItem: AssetItemPortfolio;
}) {
	return (
		<>
			<title>Add Transaction</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: "Asset Items", href: "/asset-items" },
					{ title: assetItem.name, href: `/asset-items/${assetItem.id}` },
					{
						title: "Add Transaction",
						href: `/asset-items/${assetItem.id}/transactions/add`,
					},
				]}
			/>
			<div className="container mx-auto p-2 h-full">
				<Card className="p-8 max-w-screen-sm mx-auto">
					<AddTransactionForm assetItem={assetItem} />
				</Card>
			</div>
		</>
	);
}
