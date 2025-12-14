'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Locale, User } from '@/types';

export default function useUpdateProfileMutation() {
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
			await primalApiClient.patch('users/profile', data);
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['users', 'me'],
			});
		},
	});
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
