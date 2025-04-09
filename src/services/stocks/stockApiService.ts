import axios from 'axios';
import Papa from 'papaparse';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const stocksApiClient = axios.create({
	baseURL: `https://www.alphavantage.co`,
	validateStatus: () => true,
});

export type SymbolSearchResponse = {
	symbol: string;
	name: string;
	type: string;
	region: string;
	marketOpen: string;
	marketClose: string;
	timezone: string;
	currency: string;
	matchScore: number;
};

export async function searchSymbol(symbol: string) {
	const response = await stocksApiClient.get(
		`/query?apikey=${API_KEY}&datatype=csv&function=SYMBOL_SEARCH&keywords=${symbol}`,
		{ responseType: 'text' }
	);

	if (response.status !== 200) {
		throw new Error('Failed to fetch symbol data');
	}

	const parsed = Papa.parse<SymbolSearchResponse>(response.data, {
		header: true,
		skipEmptyLines: true,
	});

	if (parsed.errors.length > 0) {
		throw new Error('Failed to parse symbol data');
	}

	return parsed.data.sort((a, b) => {
		return b.matchScore - a.matchScore;
	});
}
