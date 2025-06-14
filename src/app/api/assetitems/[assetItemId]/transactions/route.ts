import addTransaction from '@/app/api/assetitems/[assetItemId]/transactions/handlers/addTransaction';
import getAllTransactions from '@/app/api/assetitems/[assetItemId]/transactions/handlers/getAllTransactions';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getAllTransactions);
export const POST = withAuth(addTransaction);
