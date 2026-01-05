import { ColumnDef } from '@tanstack/react-table';

import CurrencyAmount from '@/components/CurrencyAmount';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import PortfolioCharts from '@/features/portfolio/components/PortfolioCharts';
import { displayAssetClassText, displayPercentage } from '@/lib/utils';
import { AssetClass, AssetClassPortfolio } from '@/types';

const columns: ColumnDef<AssetClassPortfolio>[] = [
	createColumnDef({
		accessorKey: 'id',
		headerText: 'Asset Class',
		cellTextFn: (data) => displayAssetClassText(data.id as AssetClass),
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'investedValue',
		id: 'Invested Value',
		headerText: 'Invested Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.investedValue} />,
		sortingFnCompare: (data) => data.investedValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'investedValuePercent',
		headerText: 'Invested Value (%)',
		cellTextFn: (data) => displayPercentage(data.investedValuePercent),
		sortingFnCompare: (data) => data.investedValuePercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValue',
		id: 'Current Value',
		headerText: 'Current Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.currentValue} />,
		sortingFnCompare: (data) => data.currentValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValuePercent',
		headerText: 'Current Value (%)',
		cellTextFn: (data) => displayPercentage(data.currentValuePercent),
		sortingFnCompare: (data) => data.currentValuePercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'xirrPercent',
		headerText: 'XIRR (%)',
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
		sortingFnCompare: (data) => data.xirrPercent,
		enableHiding: false,
	}),
];

export default function PortfolioPerAssetClassSection({
	portfolios,
}: {
	portfolios: AssetClassPortfolio[];
}) {
	return (
		<div className='mx-auto'>
			<PortfolioCharts
				portfolios={portfolios}
				labelFn={(portfolio) =>
					displayAssetClassText(portfolio.id as AssetClass)
				}
			/>
			<DataTable
				id='portfolio-per-asset-class'
				columns={columns}
				data={portfolios}
				initialSorting={[
					{
						id: 'investedValuePercent',
						desc: true,
					},
				]}
			/>
		</div>
	);
}
