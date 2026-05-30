import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import {
	type RegisteredRouter,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import axios from "axios";

import useAccessTokenQuery from "@/hooks/useAccessTokenQuery";

export const usePrimalApiClient = () => {
	const { data: accessToken } = useAccessTokenQuery();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const apiClient = axios.create({
		baseURL: "http://localhost:5185/api",
		headers: {
			"Content-type": "application/json",
		},
		validateStatus: () => true,
	});

	apiClient.interceptors.request.use((config) => {
		const token = accessToken || localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	apiClient.interceptors.response.use(
		async (response) => {
			if (response.status === 401 && response.config.headers.Authorization) {
				return await handleUnauthorized(queryClient, pathname, navigate);
			}
			return response;
		},
		async (error) => {
			if (
				error.response?.status === 401 &&
				error.config?.headers?.Authorization
			) {
				return await handleUnauthorized(queryClient, pathname, navigate);
			}
			return error;
		},
	);

	return apiClient;
};

async function handleUnauthorized(
	queryClient: QueryClient,
	pathname: string,
	navigate: ReturnType<typeof useNavigate<RegisteredRouter>>,
) {
	localStorage.removeItem("accessToken");
	queryClient.clear();

	if (pathname && pathname !== "/") {
		navigate({ to: "/" });
	}

	return Promise.reject(new Error("Unauthorized"));
}
