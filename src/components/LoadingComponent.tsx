import { Label } from '@/components/ui/label';

export default function LoadingComponent({
	loadingMessage,
}: {
	loadingMessage: string;
}) {
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<Label>{loadingMessage}</Label>
		</div>
	);
}
