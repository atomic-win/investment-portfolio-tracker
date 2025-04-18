import { withAuth } from '@/lib/withAuth';
import getValuation from './handlers/getValuation';

export const GET = withAuth(getValuation);
