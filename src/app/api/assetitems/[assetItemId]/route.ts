import deleteAssetItem from '@/app/api/assetitems/[assetItemId]/handlers/deleteAssetItem';
import getAssetItem from '@/app/api/assetitems/[assetItemId]/handlers/getAssetItem';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getAssetItem);
export const DELETE = withAuth(deleteAssetItem);
