import SidebarTriggerWithBreadcrumb from "@/components/sidebar-trigger-with-breadcrumb";
import { Card } from "@/components/ui/card";
import { withAssetItemPortfolio } from "@/features/portfolio/hoc/with-asset-item-portfolio";
import type { AssetItemPortfolio } from "@/types";
import EditTransactionForm from "./edit-transaction-form";

export default function Page({
	assetItemId,
	transactionId,
}: {
	assetItemId: string;
	transactionId: string;
}) {
	const WrappedComponent = withAssetItemPortfolio(PageComponent);

	return (
		<WrappedComponent assetItemId={assetItemId} transactionId={transactionId} />
	);
}

function PageComponent({
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
