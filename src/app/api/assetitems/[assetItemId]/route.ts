import { withAuth } from '@/lib/withAuth';
import getAssetItem from './handlers/getAssetItem';

export const GET = withAuth(getAssetItem);
