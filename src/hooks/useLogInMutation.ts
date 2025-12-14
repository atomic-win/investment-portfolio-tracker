import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';

export const useLogInMutation = () => {
	const primalApiClient = usePrimalApiClient();
	const queryClient = useQueryClient();
	const { replace } = useRouter();

	return useMutation({
		mutationFn: async (idToken: string) => {
			const response = await primalApiClient.post('auth/login/google', {
				idToken,
			});

			const accessToken = response.data.accessToken;
			localStorage.setItem('accessToken', accessToken);

			queryClient.removeQueries();
			queryClient.clear();

			replace('/');
		},
	});
};
