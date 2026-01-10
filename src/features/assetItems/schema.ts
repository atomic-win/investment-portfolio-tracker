import { z } from 'zod';

import { AssetClass, AssetType, Currency, TransactionType } from '@/types';
import { isAmountRequired } from '@/features/transactions/lib/utils';

export type AddAssetItemRequest = z.infer<typeof AddAssetItemSchema>;

export type AddTransactionRequest = z.infer<typeof TransactionFormSchema> & {
	assetItemId: string;
};

export type EditTransactionRequest = z.infer<typeof TransactionFormSchema> & {
	assetItemId: string;
	transactionId: string;
};

export const AddAssetItemSchema = z
	.object({
		name: z.string().min(3).max(50),
		assetClass: z.nativeEnum(AssetClass).optional(),
		assetType: z.nativeEnum(AssetType),
		schemeCode: z.number().int().min(100000).max(999999).optional(),
		symbol: z.string().optional(),
		currency: z
			.nativeEnum(Currency)
			.refine((val) => val !== Currency.Unknown, {
				message: 'Currency cannot be Unknown',
			})
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (!!!data.assetClass) {
			if (isAssetClassInputSupported(data.assetType)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Asset Class is required for ${data.assetType}`,
				});
			}
			return;
		}

		if (!isAssetClassInputSupported(data.assetType)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Asset Class is not required for ${data.assetType}`,
			});
		}
	})
	.superRefine((data, ctx) => {
		if (!!!data.schemeCode) {
			if (isSchemeCodeInputSupported(data.assetType)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Scheme Code is required for ${data.assetType}`,
				});
			}
			return;
		}
		if (!isSchemeCodeInputSupported(data.assetType)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Scheme Code is not required for ${data.assetType}`,
			});
		}
	})
	.superRefine((data, ctx) => {
		if (!!!data.symbol) {
			if (isSymbolInputSupported(data.assetType)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Symbol is required for ${data.assetType}`,
				});
			}
			return;
		}
		if (!isSymbolInputSupported(data.assetType)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Symbol is not required for ${data.assetType}`,
			});
		}
	})
	.superRefine((data, ctx) => {
		if (!!!data.currency) {
			if (isCurrencyInputSupported(data.assetType)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Currency is required for ${data.assetType}`,
				});
			}
			return;
		}
		if (!isCurrencyInputSupported(data.assetType)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Currency is not required for ${data.assetType}`,
			});
		}
	});

export const TransactionFormSchema = z
	.object({
		date: z.coerce.date({
			required_error: 'Transaction date is required',
		}),
		name: z
			.string()
			.min(3, {
				message: 'Transaction name must be at least 3 characters',
			})
			.max(1000, {
				message: 'Transaction name must be at most 1000 characters',
			}),
		transactionType: z.nativeEnum(TransactionType, {
			required_error: 'Transaction type is required',
		}),
		units: z.coerce.number().min(0, {
			message: 'Units must be at least 0',
		}),
		price: z.coerce.number().min(0, {
			message: 'Price must be at least 0',
		}),
		amount: z.coerce.number().min(0, {
			message: 'Amount must be at least 0',
		}),
	})
	.superRefine((data, ctx) => {
		if (isAmountRequired(data.transactionType)) {
			if (data.amount <= 0) {
				ctx.addIssue({
					code: 'invalid_arguments',
					message: `Amount must be greater than 0 for ${data.transactionType} transactions`,
					path: ['amount'],
					argumentsError: new z.ZodError([]),
				});
			}
		} else {
			if (data.units <= 0) {
				ctx.addIssue({
					code: 'invalid_arguments',
					message: `Units must be greater than 0 for ${data.transactionType} transactions`,
					path: ['units'],
					argumentsError: new z.ZodError([]),
				});
			}

			if (data.price <= 0) {
				ctx.addIssue({
					code: 'invalid_arguments',
					message: `Price must be greater than 0 for ${data.transactionType} transactions`,
					path: ['price'],
					argumentsError: new z.ZodError([]),
				});
			}
		}
	});

export function isAssetClassInputSupported(assetType: AssetType) {
	return (
		assetType !== AssetType.MutualFund &&
		getApplicableAssetClasses(assetType).length > 1
	);
}

export function isSchemeCodeInputSupported(assetType: AssetType) {
	return assetType === AssetType.MutualFund;
}

export function isSymbolInputSupported(assetType: AssetType) {
	return assetType === AssetType.Stock;
}

export function isCurrencyInputSupported(assetType: AssetType) {
	return assetType !== AssetType.MutualFund && assetType !== AssetType.Stock;
}

export function getApplicableAssetClasses(assetType: AssetType) {
	switch (assetType) {
		case AssetType.BankAccount:
		case AssetType.FixedDeposit:
		case AssetType.Wallet:
		case AssetType.TradingAccount:
			return [AssetClass.Debt, AssetClass.EmergencyFund];
		case AssetType.EPF:
		case AssetType.PPF:
		case AssetType.Bond:
			return [AssetClass.Debt];
		case AssetType.MutualFund:
			return [AssetClass.Equity, AssetClass.Debt];
		case AssetType.Stock:
			return [AssetClass.Equity];
		default:
			throw new Error(`Unsupported asset type: ${assetType}`);
	}
}

export function getApplicableTransactionTypes(
	assetType: AssetType
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
