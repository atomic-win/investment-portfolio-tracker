'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserSettingTable } from '@/drizzle/schema';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';

export default function useUpdateSettingsMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (
			settings: Partial<
				Omit<
					typeof UserSettingTable.$inferSelect,
					'id' | 'createdAt' | 'updatedAt'
				>
			>
		) => {
			await primalApiClient.put('users/me/settings', {
				...settings,
			});
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['users', 'me', 'settings'],
			});
		},
	});
}
