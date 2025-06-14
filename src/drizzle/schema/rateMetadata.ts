import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DateTime } from 'luxon';

import { createdAt, updatedAt } from '@/drizzle/schemaHelpers';

export const RateMetadataTable = sqliteTable('rate_metadata', {
	id: text('id').primaryKey(),
	refreshedAt: text('refreshed_at')
		.notNull()
		.$defaultFn(() => DateTime.now().toISO()),
	createdAt,
	updatedAt,
});
