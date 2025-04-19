import { useQuery } from '@tanstack/react-query';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { UserTable } from '@/drizzle/schema';

export const useMyProfileQuery = () => {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['users', 'me'],
		queryFn: async () => {
			const response = await primalApiClient.get('users/me');
			return response.data as Omit<
				typeof UserTable.$inferSelect,
				'createdAt' | 'updatedAt'
			>;
		},
	});
};
