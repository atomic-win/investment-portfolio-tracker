import { withAuth } from '@/lib/withAuth';
import deleteTransaction from './handlers/deleteTransaction';

export const DELETE = withAuth(deleteTransaction);
