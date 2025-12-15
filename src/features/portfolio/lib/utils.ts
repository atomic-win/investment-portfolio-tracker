import { PortfolioType } from '@/types';

export function displayPortfolioType(portfolioType: PortfolioType): string {
	switch (portfolioType) {
		case PortfolioType.Overall:
			return 'Overall';
		case PortfolioType.PerAssetClass:
			return 'Per Asset Class';
		case PortfolioType.PerAssetType:
			return 'Per Asset Type';
		case PortfolioType.PerAssetItem:
			return 'Per Asset Item';
		default:
			throw new Error(`Unknown portfolio type: ${portfolioType}`);
	}
}
