import { createFileRoute } from "@tanstack/react-router";
import AddTransactionPage from "@/features/transactions/components/add-transaction-page";

export const Route = createFileRoute(
	"/asset-items/$assetItemId/transactions/add",
)({
	component: AddTransactionRoute,
});

function AddTransactionRoute() {
	const { assetItemId } = Route.useParams();
	return <AddTransactionPage assetItemId={assetItemId} />;
}
