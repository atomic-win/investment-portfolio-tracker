import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import {
	type RegisteredRouter,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import axios from "axios";

import { useAccessToken } from "@/hooks/use-access-token";

export const usePrimalApiClient = () => {
	const [accessToken, , removeAccessToken] = useAccessToken();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const apiClient = axios.create({
		baseURL: "http://localhost:5185/api",
		headers: {
			"Content-type": "application/json",
		},
	});

	apiClient.interceptors.request.use((config) => {
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	});

	apiClient.interceptors.response.use(undefined, async (error) => {
		if (
			error.response?.status === 401 &&
			!error.config.url?.startsWith("auth/login")
		) {
			return await handleUnauthorized(
				removeAccessToken,
				queryClient,
				pathname,
				navigate,
			);
		}
		return Promise.reject(error);
	});

	return apiClient;
};

async function handleUnauthorized(
	removeAccessToken: () => void,
	queryClient: QueryClient,
	pathname: string,
	navigate: ReturnType<typeof useNavigate<RegisteredRouter>>,
) {
	removeAccessToken();
	queryClient.clear();

	if (pathname && pathname !== "/") {
		await navigate({ to: "/" });
	}

	return Promise.reject(new Error("Unauthorized"));
}
