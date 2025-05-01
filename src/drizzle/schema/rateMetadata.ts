import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, updatedAt } from '../schemaHelpers';
import { DateTime } from 'luxon';

export const RateMetadataTable = sqliteTable('rate_metadata', {
	id: text('id').primaryKey(),
	refreshedAt: text('refreshed_at')
		.notNull()
		.$defaultFn(() => DateTime.now().toISO()),
	createdAt,
	updatedAt,
});
