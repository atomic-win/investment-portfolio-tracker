import { AssetItemPortfolio, TransactionType, AssetType } from '@/types';

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

export function getUnitLabelText(
	assetItem: AssetItemPortfolio,
	transactionType: TransactionType
) {
	switch (assetItem.assetType) {
		case AssetType.BankAccount:
		case AssetType.Wallet:
		case AssetType.FixedDeposit:
		case AssetType.EPF:
		case AssetType.PPF:
		case AssetType.TBill:
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
