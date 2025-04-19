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
	Instrument,
	PortfolioType,
	Transaction,
} from '@/features/lib/types';
import withAssets from '@/features/components/hoc/withAssets';
import withInstruments from '@/features/components/hoc/withInstruments';
import { withOverallPortfolios } from '@/features/components/hoc/withOverallPortfolios';
import { withInstrumentTypePortfolios } from '@/features/components/hoc/withInstrumentTypePortfolios';
import { withInstrumentPortfolios } from '@/features/components/hoc/withInstrumentPortfolios';
import { withAssetPortfolios } from '@/features/components/hoc/withAssetPortfolios';
import withInvestmentsFilter from '@/features/components/hoc/withInvestmentsFilter';
import withCurrency from '@/features/components/hoc/withCurrency';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { displayPortfolioType } from '@/features/lib/utils';
import withTransactions from '@/features/components/hoc/withTransactions';

export default function withPortfolios(
	OverallSection: React.ComponentType<{
		portfolios: OverallPortfolio[];
	}>,
	InstrumentTypeSection: React.ComponentType<{
		portfolios: AssetClassPortfolio[];
	}>,
	InstrumentSection: React.ComponentType<{
		portfolios: AssetTypePortfolio[];
	}>,
	AssetSection: React.ComponentType<{
		portfolios: AssetItemPortfolio[];
	}>
) {
	return function WithPortfolios({ latest }: { latest: boolean }) {
		const WithLoadedComponent = withAssets(
			withInstruments(
				withInvestmentsFilter(withCurrency(withTransactions(Page)))
			)
		);

		return (
			<WithLoadedComponent
				latest={latest}
				OverallSection={OverallSection}
				InstrumentTypeSection={InstrumentTypeSection}
				InstrumentSection={InstrumentSection}
				AssetSection={AssetSection}
			/>
		);
	};
}

function Page({
	assetIds,
	assets,
	instruments,
	transactions,
	latest,
	OverallSection,
	InstrumentTypeSection,
	InstrumentSection,
	AssetSection,
}: {
	assetIds: string[];
	assets: AssetItem[];
	instruments: Instrument[];
	transactions: Transaction[];
	latest: boolean;
	OverallSection: React.ComponentType<{
		portfolios: OverallPortfolio[];
	}>;
	InstrumentTypeSection: React.ComponentType<{
		portfolios: AssetClassPortfolio[];
	}>;
	InstrumentSection: React.ComponentType<{
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

	const WithLoadedInstrumentTypeSection = withCurrency(
		withInstrumentTypePortfolios(InstrumentTypeSection)
	);

	const WithLoadedInstrumentSection = withCurrency(
		withInstrumentPortfolios(InstrumentSection)
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
						<TabsTrigger value={PortfolioType.PerInvestmentInstrumentType}>
							{displayPortfolioType(PortfolioType.PerInvestmentInstrumentType)}
						</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerInvestmentInstrument}>
							{displayPortfolioType(PortfolioType.PerInvestmentInstrument)}
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
							assetIds={assetIds}
							assets={assets}
							instruments={instruments}
							transactions={transactions}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerInvestmentInstrumentType}
						title='Per Instrument Type'
						description='Stats for each instrument type in the portfolio'>
						<WithLoadedInstrumentTypeSection
							assetIds={assetIds}
							assets={assets}
							instruments={instruments}
							transactions={transactions}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerInvestmentInstrument}
						title='Per Instrument'
						description='Stats for each instrument in the portfolio'>
						<WithLoadedInstrumentSection
							assetIds={assetIds}
							assets={assets}
							instruments={instruments}
							transactions={transactions}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAsset}
						title='Per Asset'
						description='Stats for each asset in the portfolio'>
						<WithLoadedAssetSection
							assetIds={assetIds}
							instruments={instruments}
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
