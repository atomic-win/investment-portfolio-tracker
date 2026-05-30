import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { usePrimalApiClient } from "@/hooks/usePrimalApiClient";

export const useLogInMutation = () => {
	const primalApiClient = usePrimalApiClient();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (idToken: string) => {
			const response = await primalApiClient.post("auth/login/google", {
				idToken,
			});

			const accessToken = response.data.accessToken;
			localStorage.setItem("accessToken", accessToken);

			queryClient.removeQueries();
			queryClient.clear();

			await navigate({ to: "/", replace: true });
		},
	});
};
