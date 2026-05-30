import { createFileRoute } from "@tanstack/react-router";
import AddTransactionPage from "@/features/transactions/components/AddTransactionPage";

export const Route = createFileRoute(
	"/assetitems/$assetItemId/transactions/add",
)({
	component: AddTransactionRoute,
});

function AddTransactionRoute() {
	const { assetItemId } = Route.useParams();
	return <AddTransactionPage assetItemId={assetItemId} />;
}
