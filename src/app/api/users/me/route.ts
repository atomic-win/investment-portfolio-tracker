import getMe from '@/app/api/users/me/handlers/getMe';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getMe);
