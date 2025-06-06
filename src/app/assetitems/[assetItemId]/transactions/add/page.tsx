import AddTransactionPage from '@/features/transactions/components/AddTransactionPage';

export default async function Page({
	params,
}: {
	params: Promise<{ assetItemId: string }>;
}) {
	const { assetItemId } = await params;

	return <AddTransactionPage assetItemId={assetItemId} />;
}
