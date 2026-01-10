import { z } from 'zod';

import { AssetClass, AssetType, Currency } from '@/types';
import {
	isAssetClassInputSupported,
	isSchemeCodeInputSupported,
	isSymbolInputSupported,
	isCurrencyInputSupported,
} from '@/features/assetItems/lib/utils';

export type AddAssetItemRequest = z.infer<typeof AddAssetItemSchema>;

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
