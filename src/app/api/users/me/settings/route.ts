import { withAuth } from '@/lib/withAuth';
import getSettings from './handlers/getSettings';
import putSettings from './handlers/putSettings';

export const GET = withAuth(getSettings);
export const PUT = withAuth(putSettings);
