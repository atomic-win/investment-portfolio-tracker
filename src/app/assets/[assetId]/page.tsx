import AssetItemPage from '@/features/assetItems/client/components/AssetItemPage';

export default async function Page({
	params,
}: {
	params: Promise<{ assetId: string }>;
}) {
	const { assetId } = await params;
	return <AssetItemPage assetId={assetId} />;
}
