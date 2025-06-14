import { useQuery } from '@tanstack/react-query';

import { UserSettingTable } from '@/drizzle/schema';
import useAccessTokenQuery from '@/hooks/useAccessTokenQuery';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';

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
