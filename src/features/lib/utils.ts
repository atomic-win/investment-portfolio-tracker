import { PortfolioType } from '@/features/lib/types';

export function displayNumber(number: number) {
	return Intl.NumberFormat('en-IN').format(number);
}

export function displayPortfolioType(portfolioType: PortfolioType): string {
	switch (portfolioType) {
		case PortfolioType.Overall:
			return 'Overall';
		case PortfolioType.PerAssetClass:
			return 'Per Asset Class';
		case PortfolioType.PerAssetType:
			return 'Per Asset Type';
		case PortfolioType.PerAsset:
			return 'Per Asset';
		default:
			throw new Error(`Unknown portfolio type: ${portfolioType}`);
	}
}
