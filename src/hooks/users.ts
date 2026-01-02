import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Locale, User } from '@/types';

export function useUserQuery() {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['users', 'me'],
		queryFn: async () => {
			const response = await primalApiClient.get<User>('users/me');
			return {
				...response.data,
				preferredLocale: convertToClientLocale(
					response.data.preferredLocale
				),
			};
		},
	});
}

export function useUpdateUserMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (
			settings: Partial<
				Omit<
					User,
					'id' | 'firstName' | 'lastName' | 'fullName' | 'email'
				>
			>
		) => {
			const data = settings.preferredLocale
				? {
						...settings,
						preferredLocale: convertToServerLocale(
							settings.preferredLocale
						),
				  }
				: settings;
			await primalApiClient.patch('users/me', data);
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['users', 'me'],
			});
		},
	});
}

function convertToClientLocale(localeStr: string) {
	switch (localeStr) {
		case 'EN_US':
			return 'en-US';
		case 'EN_IN':
			return 'en-IN';
		default:
			throw new Error(`Unsupported locale from server: ${localeStr}`);
	}
}

function convertToServerLocale(locale: Locale) {
	switch (locale) {
		case 'en-US':
			return 'EN_US';
		case 'en-IN':
			return 'EN_IN';
		default:
			throw new Error(`Unsupported locale: ${locale}`);
	}
}
