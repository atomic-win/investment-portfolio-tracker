import { primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, updatedAt } from '@/drizzle/schemaHelpers';
import { Currency } from '@/types';

export const ExchangeRateTable = sqliteTable(
	'exchange_rates',
	{
		from: text('from').notNull().$type<Currency>(),
		to: text('to').notNull().$type<Currency>(),
		date: text('date').notNull(),
		rate: real('rate').notNull(),
		createdAt,
		updatedAt,
	},
	(table) => [
		primaryKey({
			name: 'exchange_rates_pkey',
			columns: [table.from, table.to, table.date],
		}),
	]
);
