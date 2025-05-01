import { Rate } from '@/types';
import { DateTime } from 'luxon';
import yahooFinance from 'yahoo-finance2';

export type SymbolSearchResponse = {
	symbol: string;
	name: string;
	currency: string;
};

export async function searchSymbol(symbol: string) {
	const searchResult = await yahooFinance.quote(symbol);

	if (!!!searchResult) {
		return null;
	}

	return {
		symbol: searchResult.symbol,
		name: searchResult.longName,
		currency: searchResult.currency,
	} as SymbolSearchResponse;
}

export async function getStockRates(symbol: string) {
	const stockRates = await yahooFinance.chart(symbol, {
		period1: '2017-01-01',
		events: '',
	});

	return stockRates.quotes
		.filter((quote) => quote.close !== null)
		.map((quote) => ({
			date: DateTime.fromJSDate(quote.date),
			rate: quote.close,
		})) as Rate[];
}
