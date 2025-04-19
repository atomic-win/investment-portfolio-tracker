import { text } from 'drizzle-orm/sqlite-core';
import { DateTime } from 'luxon';
import { v7 } from 'uuid';

export const id = text('id')
	.notNull()
	.primaryKey()
	.$defaultFn(() => v7());

export const createdAt = text('created_at')
	.notNull()
	.$defaultFn(() => DateTime.now().toISO());

export const updatedAt = text('updated_at')
	.notNull()
	.$defaultFn(() => DateTime.now().toISO())
	.$onUpdate(() => DateTime.now().toISO());
