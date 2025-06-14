import { withAuth } from '@/lib/withAuth';
import getMe from '@/app/api/users/me/handlers/getMe';

export const GET = withAuth(getMe);
