import { NextRequest, NextResponse } from 'next/server';
import { AssetType, AuthClaims, Currency } from '@/types';
import { z } from 'zod';
import {
	addAsset,
	addAssetId,
	addAssetItem,
	getAssetId,
} from '@/features/assetItems/db';

const AssetItemSchema = z
	.object({
		name: z.string().min(3).max(50),
		type: z.nativeEnum(AssetType),
		externalId: z.string().optional(),
		currency: z
			.nativeEnum(Currency)
			.refine((val) => val !== Currency.Unknown, {
				message: 'Currency cannot be Unknown',
			})
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (
			(data.type === AssetType.MutualFunds || data.type === AssetType.Stocks) &&
			data.currency
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Currency should not be provided for Mutual Funds or Stocks',
				path: ['currency'],
			});
		}

		if (data.type === AssetType.MutualFunds) {
			if (!data.externalId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'External ID is required for Mutual Funds',
					path: ['externalId'],
				});
			} else {
				const schemeCode = z.coerce
					.number()
					.int()
					.min(100000)
					.max(999999)
					.safeParse(data.externalId);

				if (!schemeCode.success) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'External ID must be a 6-digit number',
						path: ['externalId'],
					});
				}
			}

			return;
		}

		if (data.type === AssetType.Stocks && !data.externalId) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'External ID is required for Stocks',
				path: ['externalId'],
			});

			return;
		}

		if (!data.currency) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Currency is required',
				path: ['currency'],
			});
		}
	});

export default async function handler(req: NextRequest, claims: AuthClaims) {
	const userId = claims.id;

	try {
		const body = await req.json();

		const parsedBody = AssetItemSchema.safeParse(body);

		if (!parsedBody.success) {
			return NextResponse.json(
				{ error: 'Invalid request body', issues: parsedBody.error.errors },
				{ status: 400 }
			);
		}

		const { name, type, externalId, currency } = parsedBody.data;

		switch (type) {
			case AssetType.MutualFunds:
				addMutualFundAssetItem({
					userId,
					name,
					schemeCode: Number(externalId),
				});
				break;
			case AssetType.Stocks:
				addStockAssetItem({
					userId,
					name,
					symbol: externalId!,
				});
				break;
			default:
				addDebtAssetItem({
					userId,
					name,
					type,
					currency: currency!,
				});
		}

		return new NextResponse(null, { status: 201 });
	} catch (error) {
		console.error('Error while adding asset item:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}

export async function addMutualFundAssetItem({
	userId,
	name,
	schemeCode,
}: {
	userId: string;
	name: string;
	schemeCode: number;
}) {}

export async function addStockAssetItem({
	userId,
	name,
	symbol,
}: {
	userId: string;
	name: string;
	symbol: string;
}) {}

export async function addDebtAssetItem({
	userId,
	name,
	type,
	currency,
}: {
	userId: string;
	name: string;
	type: AssetType;
	currency: Currency;
}) {
	const assetId = await getAssetId(type, Currency.Unknown);

	if (assetId) {
		await addAssetItem({
			userId,
			name,
			assetId,
			currency,
		});
	}

	const newAsset = await addAsset({
		name,
		type,
		currency: Currency.Unknown,
	});

	await addAssetId({
		type,
		externalId: Currency.Unknown,
		assetId: newAsset.id,
	});

	await addAssetItem({
		userId,
		name,
		assetId: newAsset.id,
		currency,
	});
}
