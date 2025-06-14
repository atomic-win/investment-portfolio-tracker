import getSettings from '@/app/api/users/me/settings/handlers/getSettings';
import putSettings from '@/app/api/users/me/settings/handlers/putSettings';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getSettings);
export const PUT = withAuth(putSettings);
