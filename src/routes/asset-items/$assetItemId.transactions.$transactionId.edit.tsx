import { createFileRoute } from "@tanstack/react-router";
import EditTransactionPage from "@/features/transactions/components/edit-transaction-page";

export const Route = createFileRoute(
	"/asset-items/$assetItemId/transactions/$transactionId/edit",
)({
	component: EditTransactionRoute,
});

function EditTransactionRoute() {
	const { assetItemId, transactionId } = Route.useParams();
	return (
		<EditTransactionPage
			assetItemId={assetItemId}
			transactionId={transactionId}
		/>
	);
}
