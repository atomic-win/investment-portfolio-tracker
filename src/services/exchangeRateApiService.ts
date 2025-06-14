import { DateTime } from 'luxon';
import yahooFinance from 'yahoo-finance2';

import { Currency, Rate } from '@/types';

export async function getExchangeRates(from: Currency, to: Currency) {
	const exchangeRates = await yahooFinance.chart(`${from}${to}=X`, {
		period1: '2017-01-01',
		events: '',
	});

	return exchangeRates.quotes
		.filter((quote) => quote.close !== null)
		.map((quote) => ({
			date: DateTime.fromJSDate(quote.date),
			rate: quote.close,
		})) as Rate[];
}
