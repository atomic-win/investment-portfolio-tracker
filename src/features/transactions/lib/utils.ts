import { AssetItemPortfolio, TransactionType, AssetType } from '@/types';

export function getApplicableTransactionTypes(
	assetType: AssetType,
): TransactionType[] {
	switch (assetType) {
		case AssetType.BankAccount:
		case AssetType.FixedDeposit:
		case AssetType.EPF:
		case AssetType.PPF:
			return [
				TransactionType.Deposit,
				TransactionType.Withdrawal,
				TransactionType.Interest,
				TransactionType.SelfInterest,
				TransactionType.InterestPenalty,
			];
		case AssetType.MutualFund:
			return [TransactionType.Buy, TransactionType.Sell];
		case AssetType.Stock:
			return [
				TransactionType.Buy,
				TransactionType.Sell,
				TransactionType.Dividend,
			];
		case AssetType.Wallet:
		case AssetType.TradingAccount:
			return [TransactionType.Deposit, TransactionType.Withdrawal];
		case AssetType.Bond:
			return [
				TransactionType.Buy,
				TransactionType.Sell,
				TransactionType.Interest,
			];
		default:
			throw new Error(`Unsupported asset type: ${assetType}`);
	}
}

export function isAmountRequired(transactionType: TransactionType) {
	return (
		transactionType !== TransactionType.Buy &&
		transactionType !== TransactionType.Sell
	);
}

export function displayTransactionTypeText(transactionType: TransactionType) {
	switch (transactionType) {
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

export function getUnitLabelText(
	assetItem: AssetItemPortfolio,
	transactionType: TransactionType,
) {
	switch (assetItem.assetType) {
		case AssetType.BankAccount:
		case AssetType.Wallet:
		case AssetType.FixedDeposit:
		case AssetType.EPF:
		case AssetType.PPF:
		case AssetType.Bond:
			return getAmountLabelText(assetItem);
		case AssetType.MutualFund:
			return 'Units';
		case AssetType.Stock:
			return transactionType === TransactionType.Dividend
				? getAmountLabelText(assetItem)
				: 'Shares';
		default:
			throw new Error(`Unsupported asset type: ${assetItem.assetType}`);
	}
}

function getAmountLabelText(assetItem: AssetItemPortfolio) {
	return `Amount (${assetItem.currency})`;
}
