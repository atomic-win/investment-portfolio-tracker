import deleteTransaction from '@/app/api/assetitems/[assetItemId]/transactions/[transactionId]/handlers/deleteTransaction';
import editTransaction from '@/app/api/assetitems/[assetItemId]/transactions/[transactionId]/handlers/editTransaction';
import getTransaction from '@/app/api/assetitems/[assetItemId]/transactions/[transactionId]/handlers/getTransaction';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(getTransaction);
export const PUT = withAuth(editTransaction);
export const DELETE = withAuth(deleteTransaction);
