import { withAuth } from '@/lib/withAuth';
import getAllTransactions from './handlers/getAllTransactions';
import addTransaction from './handlers/addTransaction';

export const GET = withAuth(getAllTransactions);
export const POST = withAuth(addTransaction);
