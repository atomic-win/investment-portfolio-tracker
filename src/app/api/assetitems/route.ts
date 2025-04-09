import { withAuth } from '@/lib/withAuth';
import addAssetItem from './handlers/addAssetItem';
import getAllAssetItems from './handlers/getAllAssetItems';

export const GET = withAuth(getAllAssetItems);
export const POST = withAuth(addAssetItem);
