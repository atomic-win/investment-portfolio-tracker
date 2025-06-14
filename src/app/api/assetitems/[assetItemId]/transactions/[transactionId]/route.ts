import { withAuth } from '@/lib/withAuth';
import deleteTransaction from '@/app/api/assetitems/[assetItemId]/transactions/[transactionId]/handlers/deleteTransaction';

export const DELETE = withAuth(deleteTransaction);
