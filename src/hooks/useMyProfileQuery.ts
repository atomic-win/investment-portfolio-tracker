import { useQuery } from '@tanstack/react-query';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { User } from '@/types';

export const useMyProfileQuery = () => {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['users', 'me'],
		queryFn: async () => {
			const response = await primalApiClient.get('users/profile');
			return response.data as User;
		},
	});
};
