import { Suspense } from 'react';

import LoadingComponent from '@/components/LoadingComponent';
import EditTransactionPage from '@/features/transactions/components/EditTransactionPage';

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
		<EditTransactionPage
			assetItemId={assetItemId}
			transactionId={transactionId}
		/>
	);
}
