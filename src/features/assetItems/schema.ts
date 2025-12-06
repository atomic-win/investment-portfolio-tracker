import { z } from 'zod';

import { AssetClass, AssetType, Currency, TransactionType } from '@/types';

export type AddAssetItemRequest = z.infer<typeof AddAssetItemSchema>;

export type AddTransactionRequest = z.infer<typeof AddTransactionSchema> & {
	assetItemId: string;
};

export type EditTransactionRequest = z.infer<typeof EditTransactionSchema> & {
	assetItemId: string;
	transactionId: string;
};

export const AddAssetItemSchema = z
	.object({
		name: z.string().min(3).max(50),
		assetClass: z.nativeEnum(AssetClass).optional(),
		type: z.nativeEnum(AssetType),
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
			if (isAssetClassInputSupported(data.type)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Asset Class is required for ${data.type}`,
				});
			}
			return;
		}

		if (!isAssetClassInputSupported(data.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Asset Class is not required for ${data.type}`,
			});
		}
	})
	.superRefine((data, ctx) => {
		if (!!!data.schemeCode) {
			if (isSchemeCodeInputSupported(data.type)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Scheme Code is required for ${data.type}`,
				});
			}
			return;
		}
		if (!isSchemeCodeInputSupported(data.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Scheme Code is not required for ${data.type}`,
			});
		}
	})
	.superRefine((data, ctx) => {
		if (!!!data.symbol) {
			if (isSymbolInputSupported(data.type)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Symbol is required for ${data.type}`,
				});
			}
			return;
		}
		if (!isSymbolInputSupported(data.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Symbol is not required for ${data.type}`,
			});
		}
	})
	.superRefine((data, ctx) => {
		if (!!!data.currency) {
			if (isCurrencyInputSupported(data.type)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Currency is required for ${data.type}`,
				});
			}
			return;
		}
		if (!isCurrencyInputSupported(data.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Currency is not required for ${data.type}`,
			});
		}
	});

export const AddTransactionSchema = z.object({
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
	type: z.nativeEnum(TransactionType, {
		required_error: 'Transaction type is required',
	}),
	units: z.coerce.number().positive({
		message: 'Must be greater than 0',
	}),
});

export const EditTransactionSchema = AddTransactionSchema.omit({
	date: true,
}).partial();

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
			return [AssetClass.Debt, AssetClass.EmergencyFund];
		case AssetType.Wallet:
			return [AssetClass.TradingAccount];
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
