import { Suspense } from 'react';

import LoadingComponent from '@/components/LoadingComponent';
import EditTransactionModal from '@/features/transactions/components/EditTransactionModal';

export default function Page({
	params,
}: {
	params: Promise<{ assetItemId: string; transactionId: string }>;
}) {
	return (
		<Suspense
			fallback={<LoadingComponent loadingMessage='Loading asset item...' />}>
			<SuspendedPage params={params} />
		</Suspense>
	);
}

async function SuspendedPage({
	params,
}: {
	params: Promise<{ assetItemId: string; transactionId: string }>;
}) {
	const { assetItemId, transactionId } = await params;

	return (
		<EditTransactionModal
			assetItemId={assetItemId}
			transactionId={transactionId}
		/>
	);
}
