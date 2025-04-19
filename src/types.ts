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
