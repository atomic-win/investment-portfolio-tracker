import { useQuery } from '@tanstack/react-query';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { UserSettingTable } from '@/drizzle/schema';
import useAccessTokenQuery from './useAccessTokenQuery';

export function useMySettingsQuery() {
	const primalApiClient = usePrimalApiClient();
	const { data: accessToken } = useAccessTokenQuery();

	return useQuery({
		queryKey: ['users', 'me', 'settings'],
		queryFn: async () => {
			const response = await primalApiClient.get('users/me/settings');
			return response.data as Omit<
				typeof UserSettingTable.$inferSelect,
				'createdAt' | 'updatedAt'
			>;
		},
		enabled: !!accessToken,
	});
}
