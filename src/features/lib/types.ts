import { AssetItemTable } from '@/drizzle/schema';
import { AssetClass, AssetType, TransactionType } from '@/types';

export enum PortfolioType {
	Unknown = 'Unknown',
	Overall = 'Overall',
	PerAssetClass = 'PerAssetClass',
	PerAssetType = 'PerAssetType',
	PerAsset = 'PerAsset',
}

export type AssetItem = Omit<
	typeof AssetItemTable.$inferSelect,
	'createdAt' | 'updatedAt' | 'userId' | 'assetId'
> & { assetType: AssetType };

export type Portfolio = {
	id: string;
	date: string;
	type: PortfolioType;
	investedValue: number;
	investedValuePercent: number;
	currentValue: number;
	currentValuePercent: number;
	xirrPercent: number;
};

export type OverallPortfolio = Portfolio;

export type AssetClassPortfolio = Portfolio;

export type AssetTypePortfolio = Portfolio;

export type AssetItemPortfolio = Portfolio & {
	assetName: string;
	assetClass: AssetClass;
	assetType: AssetType;
};

export type Transaction = {
	id: string;
	date: string;
	name: string;
	type: TransactionType;
	assetItemId: string;
	units: number;
	amount: number;
};

export type Valuation = {
	id: string;
	date: string;
	investedValue: number;
	currentValue: number;
	xirrPercent: number;
};
