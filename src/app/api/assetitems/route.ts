import addAssetItem from '@/app/api/assetitems/handlers/addAssetItem';
import getAllAssetItems from '@/app/api/assetitems/handlers/getAllAssetItems';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getAllAssetItems);
export const POST = withAuth(addAssetItem);
