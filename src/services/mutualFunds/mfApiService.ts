import axios from 'axios';

export type MFApiResponse = {
	meta: {
		fund_house: string;
		scheme_type: string;
		scheme_category: string;
		scheme_code: number;
		scheme_name: string;
		isin_growth: string;
		isin_div_reinvestment: string | null;
	};
	data: {
		date: string;
		nav: string;
	}[];
	status: string;
};

const mfApiClient = axios.create({
	baseURL: 'https://api.mfapi.in',
	validateStatus: () => true,
});

export async function getMutualFund(schemeCode: number) {
	return (await mfApiClient.get(`mf/${schemeCode}`)).data as MFApiResponse;
}
