import { withAuth } from '@/lib/withAuth';
import getAssetItem from '@/app/api/assetitems/[assetItemId]/handlers/getAssetItem';
import deleteAssetItem from '@/app/api/assetitems/[assetItemId]/handlers/deleteAssetItem';

export const GET = withAuth(getAssetItem);
export const DELETE = withAuth(deleteAssetItem);
