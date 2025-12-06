import { DateTime } from 'luxon';

import { AssetItemTable, TransactionTable } from '@/drizzle/schema';

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
	TradingAccount = 'TradingAccount',
}

export enum AssetType {
	BankAccount = 'BankAccount',
	Wallet = 'Wallet',
	FixedDeposit = 'FixedDeposit',
	EPF = 'EPF',
	PPF = 'PPF',
	MutualFund = 'MutualFund',
	Stock = 'Stock',
	Bond = 'Bond',
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
	PerAssetItem = 'PerAsset',
}

export type AssetItem = Omit<
	typeof AssetItemTable.$inferSelect,
	'createdAt' | 'updatedAt' | 'userId' | 'assetId'
> & {
	assetType: AssetType;
	currency: Currency;
	firstTransactionDate: string | null;
};

export type Transaction = Omit<
	typeof TransactionTable.$inferSelect,
	'createdAt' | 'updatedAt'
> & {
	amount: number;
};

export type Portfolio = {
	id: string;
	date: string;
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
	currency: Currency;
};

export type Valuation = {
	id: string;
	date: string;
	investedValue: number;
	currentValue: number;
	xirrPercent: number;
};

export type Rate = {
	date: DateTime;
	rate: number;
};
