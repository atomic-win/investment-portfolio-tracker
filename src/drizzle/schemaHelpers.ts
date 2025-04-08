import { text } from 'drizzle-orm/sqlite-core';
import { DateTime } from 'luxon';
import { v7 } from 'uuid';

export const id = text('id').notNull().primaryKey().default(v7());

export const createdAt = text('created_at')
	.notNull()
	.default(DateTime.now().toISO());

export const updatedAt = text('updated_at')
	.notNull()
	.default(DateTime.now().toISO())
	.$onUpdate(() => DateTime.now().toISO());
