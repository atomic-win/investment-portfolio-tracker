import LoadingComponent from '@/components/LoadingComponent';
import AssetItemPage from '@/features/assetItems/components/AssetItemPage';
import { Suspense } from 'react';

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

	return <AssetItemPage assetItemId={assetItemId} />;
}
