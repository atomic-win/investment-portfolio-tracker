import { TriangleAlertIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ErrorComponent({
	errorMessage,
}: {
	errorMessage: string;
}) {
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<Button size='sm' variant='ghost'>
				<TriangleAlertIcon color='red' />
				<Label className='text-destructive'>{errorMessage}</Label>
			</Button>
		</div>
	);
}
