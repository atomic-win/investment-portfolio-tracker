'use client';
import axios from 'axios';
import useAccessTokenQuery from '@/hooks/useAccessTokenQuery';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

export const usePrimalApiClient = () => {
	const { data: accessToken } = useAccessTokenQuery();
	const queryClient = useQueryClient();
	const router = useRouter();

	const headers = {
		'Content-type': 'application/json',
		Authorization: accessToken ? `Bearer ${accessToken}` : '',
	};

	const apiClient = axios.create({
		baseURL: 'http://localhost:3000/api',
		headers: headers,
		validateStatus: () => true,
	});

	apiClient.interceptors.response.use(
		async (response) => {
			if (response.status === 401) {
				return await handleUnauthorized(queryClient, router);
			}
			return response;
		},
		async (error) => {
			if (error.response.status === 401) {
				return await handleUnauthorized(queryClient, router);
			}
			return error;
		}
	);

	return apiClient;
};

async function handleUnauthorized(
	queryClient: QueryClient,
	router: AppRouterInstance
) {
	localStorage.removeItem('accessToken');
	queryClient.clear();
	router.push('/');
	return Promise.reject(new Error('Unauthorized'));
}
