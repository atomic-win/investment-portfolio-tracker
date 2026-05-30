import { useNavigate, useSearch } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { displayPortfolioType } from "@/features/portfolio/lib/utils";
import { useUserQuery } from "@/hooks/users";
import { displayCurrencyAmountText, displayPercentage } from "@/lib/utils";
import type { Portfolio, PortfolioType } from "@/types";

enum TrendType {
	InvestedValue = "InvestedValue",
	CurrentValue = "CurrentValue",
	XIRR = "XIRR",
	Ratio = "Ratio",
}

export default function withPortfolioTrendsSection<
	TPortfolio extends Portfolio,
>({
	portfolioType,
	labelFn,
	showTotalInTooltip = true,
}: {
	portfolioType: PortfolioType;
	labelFn: (portfolio: TPortfolio) => string;
	showTotalInTooltip?: boolean;
}) {
	return function PortfolioTrendsSection({
		portfolios,
	}: {
		portfolios: TPortfolio[];
	}) {
		const { data: user, isFetching: isUserFetching, error } = useUserQuery();

		const search = useSearch({ strict: false }) as Record<string, unknown>;
		const navigate = useNavigate();

		if (isUserFetching || error || !user) {
			return null;
		}

		const { preferredCurrency, preferredLocale } = user;
		const activeTrendType =
			(search.trendType as TrendType) || TrendType.InvestedValue;

		function handleTabChange(trendType: TrendType) {
			navigate({
				// @ts-expect-error shared component - search params not bound to a specific route
				search: (prev: Record<string, unknown>) => ({ ...prev, trendType }),
			});
		}

		const latestPortfolios = filterLatestPortfolios(portfolios);

		const chartConfig = latestPortfolios
			.sort((a, b) => a.investedValuePercent - b.investedValuePercent)
			.reverse()
			.reduce(
				(acc, portfolio, i) => ({
					// biome-ignore lint/performance/noAccumulatingSpread: this is more readable and the performance impact is negligible since the number of portfolios is expected to be small
					...acc,
					[portfolio.id]: {
						label: labelFn(portfolio),
						color: `var(--chart-${i + 1})`,
					},
				}),
				{},
			) satisfies ChartConfig;

		const portfolioIds = latestPortfolios.map((p) => p.id);

		return (
			<Tabs
				value={activeTrendType}
				onValueChange={(value) => handleTabChange(value as TrendType)}
			>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value={TrendType.InvestedValue}>
						{displayTrendType(TrendType.InvestedValue)}
					</TabsTrigger>
					<TabsTrigger value={TrendType.CurrentValue}>
						{displayTrendType(TrendType.CurrentValue)}
					</TabsTrigger>
					<TabsTrigger value={TrendType.XIRR}>
						{displayTrendType(TrendType.XIRR)}
					</TabsTrigger>
					<TabsTrigger value={TrendType.Ratio}>
						{displayTrendType(TrendType.Ratio)}
					</TabsTrigger>
				</TabsList>
				<TabsContent value={TrendType.InvestedValue}>
					<TrendsChart
						portfolioType={portfolioType}
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle="Invested Value Trend"
						valueFn={(portfolio) => portfolio.investedValue}
						yAxisFormat={(value) =>
							displayCurrencyAmountText(
								// biome-ignore lint/style/noNonNullAssertion: we know that preferredLocale will be defined since we check for user and error states above
								preferredLocale!,
								// biome-ignore lint/style/noNonNullAssertion: we know that preferredCurrency will be defined since we check for user and error states above
								preferredCurrency!,
								value,
								"compact",
								2,
							)
						}
						showTotalInTooltip={showTotalInTooltip}
					/>
				</TabsContent>
				<TabsContent value={TrendType.CurrentValue}>
					<TrendsChart
						portfolioType={portfolioType}
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle="Current Value Trend"
						valueFn={(portfolio) => portfolio.currentValue}
						yAxisFormat={(value) =>
							displayCurrencyAmountText(
								// biome-ignore lint/style/noNonNullAssertion: we know that preferredLocale will be defined since we check for user and error states above
								preferredLocale!,
								// biome-ignore lint/style/noNonNullAssertion: we know that preferredCurrency will be defined since we check for user and error states above
								preferredCurrency!,
								value,
								"compact",
								2,
							)
						}
						showTotalInTooltip={showTotalInTooltip}
					/>
				</TabsContent>
				<TabsContent value={TrendType.XIRR}>
					<TrendsChart
						portfolioType={portfolioType}
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle="XIRR % Trend"
						valueFn={(portfolio) => portfolio.xirrPercent}
						yAxisFormat={(value) => displayPercentage(value)}
						showTotalInTooltip={false}
					/>
				</TabsContent>
				<TabsContent value={TrendType.Ratio}>
					<TrendsChart
						portfolioType={portfolioType}
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle="Current Value / Invested Value Ratio Trend"
						valueFn={(portfolio) =>
							portfolio.currentValue / Math.max(1, portfolio.investedValue)
						}
						yAxisFormat={(value) => displayNumber(value)}
						showTotalInTooltip={false}
					/>
				</TabsContent>
			</Tabs>
		);
	};
}

function TrendsChart<TPortfolio extends Portfolio>({
	portfolioType,
	portfolioIds,
	portfolios,
	chartConfig,
	chartTitle,
	valueFn,
	yAxisFormat,
	showTotalInTooltip,
}: {
	portfolioType: PortfolioType;
	portfolioIds: string[];
	portfolios: TPortfolio[];
	chartConfig: ChartConfig;
	chartTitle: string;
	valueFn: (portfolio: TPortfolio) => number;
	yAxisFormat: (value: number) => string;
	showTotalInTooltip: boolean;
}) {
	const chartDataMap = new Map<
		number,
		{
			date: number;
		}
	>();

	portfolios.forEach((portfolio) => {
		const date = DateTime.fromISO(portfolio.date).toMillis();

		if (!chartDataMap.has(date)) {
			chartDataMap.set(date, {
				date,
			});
		}

		// biome-ignore lint/style/noNonNullAssertion: we know that data will be defined since we just set it above if it wasn't
		const data = chartDataMap.get(date)!;
		chartDataMap.set(date, {
			...data,
			[portfolio.id]: valueFn(portfolio),
		});
	});

	const chartData = Array.from(chartDataMap.values()).sort(
		(a, b) => a.date - b.date,
	);

	return (
		<Card className="mx-auto mt-8 border-0 shadow-none">
			<CardHeader className="flex items-center gap-4 space-y-0 p-4 mt-2 sm:flex-row">
				<div className="grid text-center sm:text-left w-full gap-2 justify-center">
					<CardTitle>
						{chartTitle} - {displayPortfolioType(portfolioType)}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="mt-2">
					<LineChart accessibilityLayer data={chartData}>
						<CartesianGrid />
						<XAxis
							dataKey="date"
							type="number"
							scale="time"
							domain={["dataMin", "dataMax"]}
							// biome-ignore lint/style/noNonNullAssertion: we know that toISODate will return a string since the input is a valid date
							tickFormatter={(date) => DateTime.fromMillis(date).toISODate()!}
							tickLine={true}
							axisLine={true}
							tickMargin={8}
							minTickGap={32}
						/>
						<YAxis
							tickLine={true}
							axisLine={true}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={yAxisFormat}
						/>
						<ChartTooltip
							cursor={true}
							content={
								<ChartTooltipContent
									hideLabel
									className="w-full"
									formatter={(value, name, item, index) => (
										<>
											{/* Add this before the first item */}
											{index === 0 && (
												<div className="flex basis-full items-center pt-1.5 text-xs font-medium text-foreground">
													{
														// biome-ignore lint/style/noNonNullAssertion: we know that date will be defined since it's the x-axis data key
														DateTime.fromMillis(
															item.payload.date as number,
														).toISODate()!
													}
												</div>
											)}
											<div
												className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
												style={{
													backgroundColor:
														chartConfig[name as keyof typeof chartConfig]
															?.color,
												}}
											/>
											{chartConfig[name as keyof typeof chartConfig]?.label}
											<div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
												{yAxisFormat(value as number)}
											</div>
											{/* Add this after the last item */}
											{showTotalInTooltip &&
												index === Object.keys(item.payload).length - 2 && (
													<div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
														Total
														<div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
															{yAxisFormat(
																portfolioIds
																	.map((id) => item.payload[id])
																	.filter((value) => value !== undefined)
																	.reduce((acc, value) => acc + value, 0),
															)}
														</div>
													</div>
												)}
										</>
									)}
								/>
							}
						/>
						{portfolioIds.map((id) => (
							<Line
								key={id}
								type="monotone"
								dataKey={id}
								stroke={chartConfig[id]?.color}
								dot={false}
								strokeWidth={2}
							/>
						))}
						<ChartLegend
							content={<ChartLegendContent />}
							className="grid grid-cols-4 gap-2 p-0"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function filterLatestPortfolios<TPortfolio extends Portfolio>(
	portfolios: TPortfolio[],
) {
	const latestDate = portfolios
		.map((p) => p.date)
		.reduce((acc, date) => (date > acc ? date : acc), "1900-01-01");

	return portfolios.filter((p) => p.date === latestDate);
}

function displayTrendType(trendType: TrendType) {
	switch (trendType) {
		case TrendType.InvestedValue:
			return "Invested Value";
		case TrendType.CurrentValue:
			return "Current Value";
		case TrendType.XIRR:
			return "XIRR";
		case TrendType.Ratio:
			return "Ratio";
		default:
			throw new Error(`Unknown trend type: ${trendType}`);
	}
}

function displayNumber(number: number) {
	return Intl.NumberFormat("en-IN").format(number);
}
