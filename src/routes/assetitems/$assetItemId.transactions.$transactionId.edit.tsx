import { createFileRoute } from "@tanstack/react-router";
import EditTransactionPage from "@/features/transactions/components/EditTransactionPage";

export const Route = createFileRoute(
	"/assetitems/$assetItemId/transactions/$transactionId/edit",
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
