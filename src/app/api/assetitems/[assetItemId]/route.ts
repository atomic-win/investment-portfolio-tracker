import { withAuth } from '@/lib/withAuth';
import getAssetItem from './handlers/getAssetItem';
import deleteAssetItem from './handlers/deleteAssetItem';

export const GET = withAuth(getAssetItem);
export const DELETE = withAuth(deleteAssetItem);
