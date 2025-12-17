import { ColumnDef } from '@tanstack/react-table';

import CurrencyAmount from '@/components/CurrencyAmount';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import DeleteAssetItemDialog from '@/features/assetItems/components/DeleteAssetItemDialog';
import {
	displayAssetClassText,
	displayAssetTypeText,
	displayPercentage,
} from '@/lib/utils';
import { AssetItemPortfolio } from '@/types';

const columns: ColumnDef<AssetItemPortfolio>[] = [
	createColumnDef({
		accessorKey: 'id',
		headerText: 'Asset Item',
		linkFn: (data) => `/assetitems/${data.id}`,
		cellTextFn: (data) => data.name,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'assetType',
		id: 'Asset Type',
		headerText: 'Asset Type',
		cellTextFn: (data) => displayAssetTypeText(data.assetType),
		sortingFnCompare: (data) => displayAssetTypeText(data.assetType),
		align: 'left',
	}),
	createColumnDef({
		accessorKey: 'assetClass',
		id: 'Asset Class',
		headerText: 'Asset Class',
		cellTextFn: (data) => displayAssetClassText(data.assetClass),
		align: 'left',
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
		id: 'Last Month Value',
		headerText: 'Last Month Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.currentValue} />,
		sortingFnCompare: (data) => data.currentValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValuePercent',
		headerText: 'Last Month Value (%)',
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
	{
		id: 'actions',
		cell: ({ row }) => {
			const item = row.original;
			return <DeleteAssetItemDialog assetItem={item} />;
		},
	},
];

export default function AssetItemsTable({
	portfolios,
}: {
	portfolios: AssetItemPortfolio[];
}) {
	return (
		<div className='mx-auto'>
			<DataTable
				id='asset-items'
				columns={columns}
				data={portfolios}
				initialSorting={[
					{
						id: 'investedValuePercent',
						desc: true,
					},
				]}
				doPagination={true}
			/>
		</div>
	);
}
