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
	EmergencyFunds = 'Emergency Funds',
}

export enum AssetType {
	CashAccounts = 'Cash Accounts',
	FixedDeposits = 'Fixed Deposits',
	EPF = 'Employee Provident Fund',
	PPF = 'Public Provident Fund',
	MutualFunds = 'Mutual Funds',
	Stocks = 'Stocks',
}

export enum TransactionType {
	Unknown = 'UNKNOWN',
	Buy = 'Buy',
	Sell = 'Sell',
	Deposit = 'Deposit',
	Withdrawal = 'Withdrawal',
	Dividend = 'Dividend',
	Interest = 'Interest',
	SelfInterest = 'Self Interest',
	InterestPenalty = 'Interest Penalty',
}

export type AuthClaims = {
	id: string;
};
