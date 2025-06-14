'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import AddAssetItemForm from '@/features/assetItems/components/AddAssetItemForm';

export default function Page() {
	return (
		<>
			<title>Add Asset Item</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Asset Items', href: '/assetitems' },
					{
						title: 'Add Asset Item',
						href: '/assetitems/add',
						disabled: true,
					},
				]}
			/>
			<div className='container mx-auto p-2 h-full'>
				<Card className='p-8 max-w-screen-sm mx-auto'>
					<AddAssetItemForm />
				</Card>
			</div>
		</>
	);
}
