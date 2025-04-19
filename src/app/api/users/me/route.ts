import { withAuth } from '@/lib/withAuth';
import getMe from './handlers/getMe';

export const GET = withAuth(getMe);
