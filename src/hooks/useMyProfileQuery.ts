import { useQuery } from '@tanstack/react-query';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { User } from '@/types';

export const useMyProfileQuery = () => {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['users', 'me'],
		queryFn: async () => {
			const response = await primalApiClient.get<User>('users/profile');
			return {
				...response.data,
				preferredLocale: convertToLocale(response.data.preferredLocale),
			};
		},
	});
};

function convertToLocale(localeStr: string) {
	switch (localeStr) {
		case 'EN_US':
			return 'en-US';
		case 'EN_IN':
			return 'en-IN';
		default:
			throw new Error(`Unsupported locale from server: ${localeStr}`);
	}
}
