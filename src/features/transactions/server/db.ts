'use server';
import { db } from '@/drizzle/db';
import { TransactionTable } from '@/drizzle/schema';
import { and, asc, eq, lte, min } from 'drizzle-orm';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { transactionsTag, transactionTag } from './cacheTag';

export async function getAllTransactions(assetItemId: string, date: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(transactionsTag(assetItemId));

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

export async function getFirstTransactionDate(assetItemId: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(transactionsTag(assetItemId));

	const firstDateRow = await db
		.select({
			date: min(TransactionTable.date),
		})
		.from(TransactionTable)
		.where(eq(TransactionTable.assetItemId, assetItemId))
		.limit(1);

	if (firstDateRow.length === 0) {
		return null;
	}

	return firstDateRow[0].date!;
}

export async function getTransaction(assetItemId: string, id: string) {
	'use cache';
	cacheLife('daily');
	cacheTag(transactionTag(assetItemId, id));

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
