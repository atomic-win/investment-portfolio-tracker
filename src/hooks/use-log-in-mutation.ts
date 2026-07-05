import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { useAccessToken } from "@/hooks/use-access-token";
import { usePrimalApiClient } from "@/hooks/use-primal-api-client";

export const useLogInMutation = () => {
	const primalApiClient = usePrimalApiClient();
	const [, setAccessToken] = useAccessToken();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (idToken: string) => {
			const response = await primalApiClient.post("auth/login/google", {
				idToken,
			});

			setAccessToken(response.data.accessToken);

			queryClient.removeQueries();
			queryClient.clear();

			if (router.history.canGoBack()) {
				router.history.back();
			} else {
				await router.navigate({ to: "/" });
			}
		},
	});
};
