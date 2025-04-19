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
	Transaction,
} from '@/features/lib/types';
import withAssetItems from '@/features/assetItems/hoc/withAssetItems';
import { withOverallPortfolios } from '@/features/portfolio/hoc/withOverallPortfolios';
import { withAssetClassPortfolios } from '@/features/portfolio/hoc/withAssetClassPortfolios';
import { withAssetTypePortfolios } from '@/features/portfolio/hoc/withAssetTypePortfolios';
import { withAssetPortfolios } from '@/features/portfolio/hoc/withAssetPortfolios';
import withInvestmentsFilter from '@/features/portfolio/hoc/withInvestmentsFilter';
import withCurrency from '@/components/hoc/withCurrency';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { displayPortfolioType } from '@/features/lib/utils';
import withTransactions from '@/features/components/hoc/withTransactions';

export default function withPortfolios(
	OverallSection: React.ComponentType<{
		portfolios: OverallPortfolio[];
	}>,
	AssetClassSection: React.ComponentType<{
		portfolios: AssetClassPortfolio[];
	}>,
	AssetTypeSection: React.ComponentType<{
		portfolios: AssetTypePortfolio[];
	}>,
	AssetSection: React.ComponentType<{
		portfolios: AssetItemPortfolio[];
	}>
) {
	return function WithPortfolios({ latest }: { latest: boolean }) {
		const WithLoadedComponent = withAssetItems(
			withInvestmentsFilter(withCurrency(withTransactions(Page)))
		);

		return (
			<WithLoadedComponent
				latest={latest}
				OverallSection={OverallSection}
				AssetClassSection={AssetClassSection}
				AssetTypeSection={AssetTypeSection}
				AssetSection={AssetSection}
			/>
		);
	};
}

function Page({
	assetIds,
	assets,
	transactions,
	latest,
	OverallSection,
	AssetClassSection,
	AssetTypeSection,
	AssetSection,
}: {
	assetIds: string[];
	assets: AssetItem[];
	transactions: Transaction[];
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
	AssetSection: React.ComponentType<{
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
		withOverallPortfolios(OverallSection)
	);

	const WithLoadedAssetClassSection = withCurrency(
		withAssetClassPortfolios(AssetClassSection)
	);

	const WithLoadedAssetTypeSection = withCurrency(
		withAssetTypePortfolios(AssetTypeSection)
	);

	const WithLoadedAssetSection = withCurrency(
		withAssetPortfolios(AssetSection)
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
						<TabsTrigger value={PortfolioType.PerAsset}>
							{displayPortfolioType(PortfolioType.PerAsset)}
						</TabsTrigger>
					</TabsList>
					<PortfolioTabsContent
						portfolioType={PortfolioType.Overall}
						title='Overall'
						description='Stats for the portfolio'>
						<WithLoadedOverallSection
							assetItemIds={assetIds}
							assetItems={assets}
							transactions={transactions}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAssetClass}
						title='Per Asset Class'
						description='Stats for each asset class in the portfolio'>
						<WithLoadedAssetClassSection
							assetItemIds={assetIds}
							assetItems={assets}
							transactions={transactions}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAssetType}
						title='Per Asset Type'
						description='Stats for each asset type in the portfolio'>
						<WithLoadedAssetTypeSection
							assetItemIds={assetIds}
							assetItems={assets}
							transactions={transactions}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAsset}
						title='Per Asset'
						description='Stats for each asset in the portfolio'>
						<WithLoadedAssetSection
							assetItemIds={assetIds}
							transactions={transactions}
							assets={assets}
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
