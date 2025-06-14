import { withAuth } from '@/lib/withAuth';
import getAllTransactions from '@/app/api/assetitems/[assetItemId]/transactions/handlers/getAllTransactions';
import addTransaction from '@/app/api/assetitems/[assetItemId]/transactions/handlers/addTransaction';

export const GET = withAuth(getAllTransactions);
export const POST = withAuth(addTransaction);
