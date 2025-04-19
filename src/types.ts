import { AssetItemTable } from './drizzle/schema';

export enum IdentityProvider {
	Google = 'Google',
}

export enum Currency {
	Unknown = 'UNKNOWN',
	USD = 'USD',
	INR = 'INR',
}

export enum Language {
	EN = 'en',
	EN_US = 'en-US',
	EN_IN = 'en-IN',
}

export enum AssetClass {
	Equity = 'Equity',
	Debt = 'Debt',
	EmergencyFund = 'EmergencyFund',
}

export enum AssetType {
	CashAccount = 'CashAccount',
	FixedDeposit = 'FixedDeposit',
	EPF = 'EPF',
	PPF = 'PPF',
	MutualFund = 'MutualFund',
	Stock = 'Stock',
}

export enum TransactionType {
	Unknown = 'UNKNOWN',
	Buy = 'Buy',
	Sell = 'Sell',
	Deposit = 'Deposit',
	Withdrawal = 'Withdrawal',
	Dividend = 'Dividend',
	Interest = 'Interest',
	SelfInterest = 'SelfInterest',
	InterestPenalty = 'InterestPenalty',
}

export type AuthClaims = {
	id: string;
};

export enum PortfolioType {
	Unknown = 'Unknown',
	Overall = 'Overall',
	PerAssetClass = 'PerAssetClass',
	PerAssetType = 'PerAssetType',
	PerAsset = 'PerAsset',
}

export type AssetItem = Omit<
	typeof AssetItemTable.$inferSelect,
	'createdAt' | 'updatedAt' | 'userId' | 'assetId'
> & { assetType: AssetType };

export type Portfolio = {
	id: string;
	date: string;
	type: PortfolioType;
	investedValue: number;
	investedValuePercent: number;
	currentValue: number;
	currentValuePercent: number;
	xirrPercent: number;
};

export type OverallPortfolio = Portfolio;

export type AssetClassPortfolio = Portfolio;

export type AssetTypePortfolio = Portfolio;

export type AssetItemPortfolio = Portfolio & {
	name: string;
	assetClass: AssetClass;
	assetType: AssetType;
};

export type Transaction = {
	id: string;
	date: string;
	name: string;
	type: TransactionType;
	assetItemId: string;
	units: number;
	amount: number;
};

export type Valuation = {
	id: string;
	date: string;
	investedValue: number;
	currentValue: number;
	xirrPercent: number;
};
