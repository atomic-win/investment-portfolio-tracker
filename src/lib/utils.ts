import { AssetClass, AssetType, TransactionType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function displayCurrencyAmountText(
	locale: string,
	currency: string,
	amount: number,
	notation: 'standard' | 'compact',
	maximumFractionDigits: number
) {
	return Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		currencyDisplay: 'symbol',
		maximumFractionDigits,
		notation,
	}).format(amount);
}

export function displayPercentage(percent: number) {
	return Intl.NumberFormat('en-IN', {
		style: 'percent',
		maximumFractionDigits: 2,
	}).format(percent / 100);
}

export function displayAssetTypeText(assetType: AssetType) {
	switch (assetType) {
		case AssetType.BankAccount:
			return 'Bank Account';
		case AssetType.Wallet:
			return 'Wallet';
		case AssetType.FixedDeposit:
			return 'Fixed Deposit';
		case AssetType.EPF:
			return 'Employee Provident Fund';
		case AssetType.PPF:
			return 'Public Provident Fund';
		case AssetType.MutualFund:
			return 'Mutual Fund';
		case AssetType.Stock:
			return 'Stock';
		case AssetType.TBill:
			return 'Treasury Bill';
		default:
			throw new Error(`Unknown asset type: ${assetType}`);
	}
}

export function displayAssetClassText(assetClass: AssetClass) {
	switch (assetClass) {
		case AssetClass.Equity:
			return 'Equity';
		case AssetClass.Debt:
			return 'Debt';
		case AssetClass.EmergencyFund:
			return 'Emergency Fund';
		case AssetClass.TradingAccount:
			return 'Trading Account';
		default:
			throw new Error(`Unknown asset class: ${assetClass}`);
	}
}

export function displayTransactionTypeText(transactionType: TransactionType) {
	switch (transactionType) {
		case TransactionType.Unknown:
			return 'Unknown';
		case TransactionType.Buy:
			return 'Buy';
		case TransactionType.Sell:
			return 'Sell';
		case TransactionType.Deposit:
			return 'Deposit';
		case TransactionType.Withdrawal:
			return 'Withdrawal';
		case TransactionType.Dividend:
			return 'Dividend';
		case TransactionType.Interest:
			return 'Interest';
		case TransactionType.SelfInterest:
			return 'Self Interest';
		case TransactionType.InterestPenalty:
			return 'Interest Penalty';
		default:
			throw new Error(`Unknown transaction type: ${transactionType}`);
	}
}
