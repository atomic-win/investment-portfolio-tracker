import { Suspense } from 'react';

import LoadingComponent from '@/components/LoadingComponent';
import AddTransactionModal from '@/features/transactions/components/AddTransactionModal';

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

	return <AddTransactionModal assetItemId={assetItemId} />;
}
