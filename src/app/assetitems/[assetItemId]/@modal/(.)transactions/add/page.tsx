import AddTransactionModal from '@/features/transactions/components/AddTransactionModal';

export default async function Page({
	params,
}: {
	params: Promise<{ assetItemId: string }>;
}) {
	const { assetItemId } = await params;

	return <AddTransactionModal assetItemId={assetItemId} />;
}
