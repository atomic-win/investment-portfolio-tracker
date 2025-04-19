import AssetItemPage from '@/features/assetItems/components/AssetItemPage';

export default async function Page({
	params,
}: {
	params: Promise<{ assetItemId: string }>;
}) {
	const { assetItemId } = await params;
	return <AssetItemPage assetItemId={assetItemId} />;
}
