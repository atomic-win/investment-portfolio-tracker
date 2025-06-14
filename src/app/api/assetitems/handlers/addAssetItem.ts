import { unstable_expireTag as expireTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AddAssetItemSchema } from '@/features/assetItems/schema';
import { assetItemsTag } from '@/features/assetItems/server/cacheTag';
import {
	addAsset,
	addAssetId,
	addAssetItem,
	getAssetId,
} from '@/features/assetItems/server/db';
import { getMutualFund } from '@/services/mfApiService';
import { searchSymbol } from '@/services/stockApiService';
import { AssetClass, AssetType, AuthClaims, Currency } from '@/types';

export default async function handler(req: NextRequest, claims: AuthClaims) {
	const userId = claims.id;

	try {
		const body = await req.json();

		const parsedBody = AddAssetItemSchema.safeParse(body);

		if (!parsedBody.success) {
			return NextResponse.json(
				{ error: 'Invalid request body', issues: parsedBody.error.errors },
				{ status: 400 }
			);
		}

		const { name, type, schemeCode, symbol, currency } = parsedBody.data;

		if (type === AssetType.MutualFund) {
			return addMutualFundAssetItem({
				userId,
				name,
				schemeCode: schemeCode!,
			});
		}

		if (type === AssetType.Stock) {
			return addStockAssetItem({
				userId,
				name,
				symbol: symbol!.toLowerCase(),
			});
		}

		if (type === AssetType.TBill) {
			return addDefaultAssetItem({
				userId,
				name,
				assetClass: AssetClass.Debt,
				type,
				currency: Currency.INR,
			});
		}

		return addDefaultAssetItem({
			userId,
			name,
			assetClass: parsedBody.data.assetClass!,
			type,
			currency: currency!,
		});
	} catch (error) {
		console.error('Error while adding asset item:', error);
		return NextResponse.json('Internal server error', { status: 500 });
	}
}

async function addMutualFundAssetItem({
	userId,
	name,
	schemeCode,
}: {
	userId: string;
	name: string;
	schemeCode: number;
}) {
	const mfApiResponse = await getMutualFund(schemeCode);

	if (
		!mfApiResponse ||
		mfApiResponse.status !== 'SUCCESS' ||
		!mfApiResponse.meta.scheme_name
	) {
		return NextResponse.json(
			{ error: 'Invalid Mutual Fund data' },
			{ status: 400 }
		);
	}

	const assetClass =
		mfApiResponse.meta.scheme_name.toLowerCase().includes('debt') ||
		mfApiResponse.meta.scheme_type.toLowerCase().includes('debt') ||
		mfApiResponse.meta.scheme_category.toLowerCase().includes('debt')
			? AssetClass.Debt
			: AssetClass.Equity;

	const newAsset = await addAsset({
		name: mfApiResponse.meta.scheme_name,
		type: AssetType.MutualFund,
		externalId: schemeCode.toString(),
		currency: Currency.INR,
	});

	const assetId = await getAssetId(AssetType.MutualFund, schemeCode.toString());

	if (assetId) {
		return await addAssetItemAndReturn({
			userId,
			name,
			assetClass,
			assetId,
		});
	}

	await addAssetId({
		type: AssetType.MutualFund,
		externalId: schemeCode.toString(),
		assetId: newAsset.id,
	});

	return await addAssetItemAndReturn({
		userId,
		name,
		assetClass,
		assetId: newAsset.id,
	});
}

async function addStockAssetItem({
	userId,
	name,
	symbol,
}: {
	userId: string;
	name: string;
	symbol: string;
}) {
	const assetId = await getAssetId(AssetType.Stock, symbol);

	if (assetId) {
		return addAssetItemAndReturn({
			userId,
			name,
			assetClass: AssetClass.Equity,
			assetId,
		});
	}

	const symbolSearchResult = await searchSymbol(symbol);

	if (!!!symbolSearchResult) {
		return NextResponse.json(
			{ error: 'Invalid stock symbol' },
			{ status: 400 }
		);
	}

	const newAsset = await addAsset({
		name: symbolSearchResult.name,
		type: AssetType.Stock,
		externalId: symbol,
		currency: z.nativeEnum(Currency).parse(symbolSearchResult.currency),
	});

	await addAssetId({
		type: AssetType.Stock,
		externalId: symbol,
		assetId: newAsset.id,
	});

	return await addAssetItemAndReturn({
		userId,
		name,
		assetClass: AssetClass.Equity,
		assetId: newAsset.id,
	});
}

async function addDefaultAssetItem({
	userId,
	name,
	assetClass,
	type,
	currency,
}: {
	userId: string;
	name: string;
	assetClass: AssetClass;
	type: AssetType;
	currency: Currency;
}) {
	const assetId = await getAssetId(type, currency);

	if (assetId) {
		return addAssetItemAndReturn({
			userId,
			name,
			assetClass,
			assetId,
		});
	}

	const newAsset = await addAsset({
		name: type,
		type,
		currency,
	});

	await addAssetId({
		type,
		externalId: currency,
		assetId: newAsset.id,
	});

	return await addAssetItemAndReturn({
		userId,
		name,
		assetClass,
		assetId: newAsset.id,
	});
}

async function addAssetItemAndReturn({
	userId,
	name,
	assetClass,
	assetId,
}: {
	userId: string;
	name: string;
	assetClass: AssetClass;
	assetId: string;
}) {
	await addAssetItem({
		userId,
		name,
		assetClass,
		assetId,
	});

	expireTag(assetItemsTag(userId));

	return new NextResponse(null, { status: 201 });
}
