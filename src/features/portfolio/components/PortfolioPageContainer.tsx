'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	OverallPortfolio,
	AssetClassPortfolio,
	AssetTypePortfolio,
	AssetItemPortfolio,
	AssetItem,
	PortfolioType,
} from '@/types';
import { withAssetItemPortfolios } from '@/features/portfolio/hoc/withAssetItemPortfolios';
import withCurrency from '@/components/hoc/withCurrency';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { displayPortfolioType } from '@/features/portfolio/lib/utils';
import { withValuations } from '@/features/portfolio/hoc/withValuations';

export default function PortfolioPageContainer({
	assetItemIds,
	assetItems,
	latest,
	OverallSection,
	AssetClassSection,
	AssetTypeSection,
	AssetItemSection,
}: {
	assetItemIds: string[];
	assetItems: AssetItem[];
	latest: boolean;
	OverallSection: React.ComponentType<{
		portfolios: OverallPortfolio[];
	}>;
	AssetClassSection: React.ComponentType<{
		portfolios: AssetClassPortfolio[];
	}>;
	AssetTypeSection: React.ComponentType<{
		portfolios: AssetTypePortfolio[];
	}>;
	AssetItemSection: React.ComponentType<{
		portfolios: AssetItemPortfolio[];
	}>;
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const activeTab =
		(searchParams.get('portfolioType') as PortfolioType) ||
		PortfolioType.Overall;

	function handleTabChange(portfolioType: PortfolioType) {
		const params = new URLSearchParams(searchParams);
		params.set('portfolioType', portfolioType);
		replace(`${pathname}?${params.toString()}`);
	}

	const WithLoadedOverallSection = withCurrency(
		withValuations(OverallSection, () => 'overall')
	);

	const WithLoadedAssetClassSection = withCurrency(
		withValuations(AssetClassSection, (assetItem) => assetItem.assetClass)
	);

	const WithLoadedAssetTypeSection = withCurrency(
		withValuations(AssetTypeSection, (assetItem) => assetItem.assetType)
	);

	const WithLoadedAssetItemSection = withCurrency(
		withAssetItemPortfolios(AssetItemSection)
	);

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md'>
			<CardContent className='p-4'>
				<Tabs
					value={activeTab}
					onValueChange={(value) => handleTabChange(value as PortfolioType)}>
					<TabsList className='grid w-full grid-cols-4'>
						<TabsTrigger value={PortfolioType.Overall}>
							{displayPortfolioType(PortfolioType.Overall)}
						</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerAssetClass}>
							{displayPortfolioType(PortfolioType.PerAssetClass)}
						</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerAssetType}>
							{displayPortfolioType(PortfolioType.PerAssetType)}
						</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerAssetItem}>
							{displayPortfolioType(PortfolioType.PerAssetItem)}
						</TabsTrigger>
					</TabsList>
					<PortfolioTabsContent
						portfolioType={PortfolioType.Overall}
						title='Overall'
						description='Stats for the portfolio'>
						<WithLoadedOverallSection
							assetItemIds={assetItemIds}
							assetItems={assetItems}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAssetClass}
						title='Per Asset Class'
						description='Stats for each asset class in the portfolio'>
						<WithLoadedAssetClassSection
							assetItemIds={assetItemIds}
							assetItems={assetItems}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAssetType}
						title='Per Asset Type'
						description='Stats for each asset type in the portfolio'>
						<WithLoadedAssetTypeSection
							assetItemIds={assetItemIds}
							assetItems={assetItems}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAssetItem}
						title='Per Asset'
						description='Stats for each asset item in the portfolio'>
						<WithLoadedAssetItemSection
							assetItemIds={assetItemIds}
							assetItems={assetItems}
							latest={latest}
						/>
					</PortfolioTabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

function PortfolioTabsContent({
	portfolioType,
	title,
	description,
	children,
}: {
	portfolioType: PortfolioType;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<TabsContent value={portfolioType}>
			<CardHeader className='flex items-center gap-4 space-y-0 border-b py-2 pt-4 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2'>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-4'>{children}</CardContent>
		</TabsContent>
	);
}
