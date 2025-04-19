import { AssetClassPortfolio } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { displayPercentage } from '@/lib/utils';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import PortfolioCharts from '@/features/portfolio/components/PortfolioCharts';
import CurrencyAmount from '@/components/CurrencyAmount';

const columns: ColumnDef<AssetClassPortfolio>[] = [
	createColumnDef({
		accessorKey: 'id',
		headerText: 'Asset Class',
		cellTextFn: (data) => data.id,
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
				labelFn={(portfolio) => portfolio.id}
			/>
			<DataTable
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
