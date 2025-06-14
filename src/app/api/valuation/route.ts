import getValuation from '@/app/api/valuation/handlers/getValuation';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getValuation);
