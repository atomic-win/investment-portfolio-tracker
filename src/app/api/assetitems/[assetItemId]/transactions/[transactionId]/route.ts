import deleteTransaction from '@/app/api/assetitems/[assetItemId]/transactions/[transactionId]/handlers/deleteTransaction';
import { withAuth } from '@/lib/withAuth';

export const DELETE = withAuth(deleteTransaction);
