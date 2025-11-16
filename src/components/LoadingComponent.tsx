import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingComponent({
	loadingMessage,
}: {
	loadingMessage: string;
}) {
	return (
		<div className='flex items-center justify-center w-full h-full gap-2'>
			<Button size='sm' variant='ghost'>
				<Spinner />
				<Label>{loadingMessage}</Label>
			</Button>
		</div>
	);
}
