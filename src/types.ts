import { DateTime } from 'luxon';

export enum Currency {
	Unknown = 'UNKNOWN',
	USD = 'USD',
	INR = 'INR',
}

export enum Locale {
	EN_US = 'en-US',
	EN_IN = 'en-IN',
}

export enum AssetClass {
	Equity = 'Equity',
	Debt = 'Debt',
	EmergencyFund = 'EmergencyFund',
}

export enum AssetType {
	BankAccount = 'BankAccount',
	Wallet = 'Wallet',
	TradingAccount = 'TradingAccount',
	FixedDeposit = 'FixedDeposit',
	EPF = 'EPF',
	PPF = 'PPF',
	MutualFund = 'MutualFund',
	Stock = 'Stock',
	Bond = 'Bond',
}

export enum TransactionType {
	Buy = 'Buy',
	Sell = 'Sell',
	Deposit = 'Deposit',
	Withdrawal = 'Withdrawal',
	Dividend = 'Dividend',
	Interest = 'Interest',
	SelfInterest = 'SelfInterest',
	InterestPenalty = 'InterestPenalty',
}

export enum PortfolioType {
	Unknown = 'Unknown',
	Overall = 'Overall',
	PerAssetClass = 'PerAssetClass',
	PerAssetType = 'PerAssetType',
	PerAssetItem = 'PerAsset',
}

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	preferredCurrency: Currency;
	preferredLocale: Locale;
};

export type AssetItem = {
	id: string;
	name: string;
	assetType: AssetType;
	assetClass: AssetClass;
	currency: Currency;
};

export type Transaction = {
	id: string;
	date: string;
	name: string;
	transactionType: TransactionType;
	assetItemId: string;
	units: number;
	price: number;
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
