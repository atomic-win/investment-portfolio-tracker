import { AssetClass, AssetType } from "@/types";

export function isAssetClassInputSupported(assetType: AssetType) {
	return getApplicableAssetClasses(assetType).length > 1;
}

export function isSchemeCodeInputSupported(assetType: AssetType) {
	return assetType === AssetType.MutualFund;
}

export function isSymbolInputSupported(assetType: AssetType) {
	return assetType === AssetType.Stock || assetType === AssetType.ETF;
}

export function isCurrencyInputSupported(assetType: AssetType) {
	return (
		assetType !== AssetType.MutualFund &&
		assetType !== AssetType.Stock &&
		assetType !== AssetType.ETF
	);
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
			return [AssetClass.Equity, AssetClass.Debt, AssetClass.Commodities];
		case AssetType.Stock:
		case AssetType.ETF:
			return [AssetClass.Equity];
		default:
			throw new Error(`Unsupported asset type: ${assetType}`);
	}
}
