import { withAuth } from '@/lib/withAuth';
import getValuation from '@/app/api/valuation/handlers/getValuation';

export const GET = withAuth(getValuation);
