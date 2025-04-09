import { withAuth } from '@/lib/withAuth';
import addAssetItem from './handlers/addAssetItem';

export const POST = withAuth(addAssetItem);
