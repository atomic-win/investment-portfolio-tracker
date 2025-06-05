'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import AddAssetItemForm from '@/features/assetItems/components/AddAssetItemForm';

export default function Page() {
	return (
		<Modal>
			<DialogContent>
				<DialogHeader>
					<SidebarTriggerWithBreadcrumb
						breadcrumbs={[
							{ title: 'Asset Items', href: '/assetitems' },
							{
								title: 'Add Asset Item',
								href: `/assetitems/add`,
								disabled: true,
							},
						]}
					/>
				</DialogHeader>

				<div className='p-2'>
					<AddAssetItemForm />
				</div>
			</DialogContent>
		</Modal>
	);
}
