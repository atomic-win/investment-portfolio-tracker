import { Suspense } from 'react';

import LoadingComponent from '@/components/LoadingComponent';
import AddTransactionPage from '@/features/transactions/components/AddTransactionPage';

export default function Page({
	params,
}: {
	params: Promise<{ assetItemId: string }>;
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
	params: Promise<{ assetItemId: string }>;
}) {
	const { assetItemId } = await params;

	return <AddTransactionPage assetItemId={assetItemId} />;
}
