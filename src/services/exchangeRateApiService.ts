import { Currency } from '@/types';
import axios from 'axios';
import Papa from 'papaparse';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const stocksApiClient = axios.create({
	baseURL: `https://www.alphavantage.co`,
	validateStatus: () => true,
});

export type ExchangeRateResponse = {
	timestamp: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

export async function getExchangeRates(from: Currency, to: Currency) {
	const response = await stocksApiClient.get(
		`/query?apikey=${API_KEY}&datatype=csv&function=FX_DAILY&from_symbol=${from}&to_symbol=${to}&outputsize=full`,
		{ responseType: 'text' }
	);

	if (response.status !== 200) {
		throw new Error('Failed to fetch symbol data');
	}

	const parsed = Papa.parse<ExchangeRateResponse>(response.data, {
		header: true,
		skipEmptyLines: true,
	});

	return parsed.data.map((data) => ({
		date: data.timestamp,
		rate: data.close,
	}));
}
