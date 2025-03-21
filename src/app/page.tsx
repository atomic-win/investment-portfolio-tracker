import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';

export default function HomePage() {
	return (
		<>
			<title>Investment Portfolio Tracker</title>
			<SidebarTriggerWithBreadcrumb breadcrumbs={[]} />
			<div className='text-center px-4 space-y-4'>
				<h1 className='text-3xl'>Investment Portfolio Tracker</h1>
			</div>
		</>
	);
}
