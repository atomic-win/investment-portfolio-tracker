import { db } from '@/drizzle/db';
import { TransactionTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function getAllTransactions(assetItemId: string) {
	return await db
		.select()
		.from(TransactionTable)
		.where(eq(TransactionTable.assetItemId, assetItemId))
		.all();
}

export async function addTransaction(
	data: typeof TransactionTable.$inferInsert
) {
	return await db.insert(TransactionTable).values(data).returning().get();
}
