import { index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAt, updatedAt } from '../schemaHelpers';
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
		index('exchange_rates_from_to_date_idx').on(
			table.from,
			table.to,
			table.date
		),
	]
);
