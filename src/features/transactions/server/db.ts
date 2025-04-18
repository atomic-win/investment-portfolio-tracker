'use server';
import { db } from '@/drizzle/db';
import { TransactionTable } from '@/drizzle/schema';
import { and, asc, eq, lte } from 'drizzle-orm';

export async function getAllTransactions(assetItemId: string, date: string) {
	'use cache';
	return await db
		.select()
		.from(TransactionTable)
		.where(
			and(
				eq(TransactionTable.assetItemId, assetItemId),
				lte(TransactionTable.date, date)
			)
		)
		.orderBy(asc(TransactionTable.date));
}

export async function getTransaction(assetItemId: string, id: string) {
	return await db
		.select()
		.from(TransactionTable)
		.where(
			and(
				eq(TransactionTable.assetItemId, assetItemId),
				eq(TransactionTable.id, id)
			)
		);
}

export async function addTransaction(
	data: typeof TransactionTable.$inferInsert
) {
	return await db.insert(TransactionTable).values(data).returning();
}

export async function deleteTransaction(id: string) {
	return await db
		.delete(TransactionTable)
		.where(eq(TransactionTable.id, id))
		.returning();
}
