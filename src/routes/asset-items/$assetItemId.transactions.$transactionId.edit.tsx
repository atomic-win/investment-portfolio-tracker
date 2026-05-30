import { createFileRoute } from "@tanstack/react-router";
import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import { Card } from "@/components/ui/card";
import { withAssetItemPortfolio } from "@/features/portfolio/hoc/with-asset-item-portfolio";
import EditTransactionForm from "@/features/transactions/components/edit-transaction-form";
import type { AssetItemPortfolio } from "@/types";

export const Route = createFileRoute(
	"/asset-items/$assetItemId/transactions/$transactionId/edit",
)({
	component: EditTransactionRoute,
});

function EditTransactionRoute() {
	const { assetItemId, transactionId } = Route.useParams();
	const WrappedComponent = withAssetItemPortfolio(EditTransactionContent);
	return (
		<WrappedComponent assetItemId={assetItemId} transactionId={transactionId} />
	);
}

function EditTransactionContent({
	assetItem,
	transactionId,
}: {
	assetItem: AssetItemPortfolio;
	transactionId: string;
}) {
	return (
		<>
			<title>Edit Transaction</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: "Asset Items", href: "/asset-items" },
					{ title: assetItem.name, href: `/asset-items/${assetItem.id}` },
					{
						title: "Edit Transaction",
						href: `/asset-items/${assetItem.id}/transactions/${transactionId}/edit`,
					},
				]}
			/>
			<div className="container mx-auto p-2 h-full">
				<Card className="p-8 max-w-screen-sm mx-auto">
					<EditTransactionForm
						assetItem={assetItem}
						transactionId={transactionId}
					/>
				</Card>
			</div>
		</>
	);
}
