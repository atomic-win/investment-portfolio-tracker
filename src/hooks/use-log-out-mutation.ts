import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAccessToken } from "@/hooks/use-access-token";

export const useLogOutMutation = () => {
	const [, , removeAccessToken] = useAccessToken();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async () => {
			removeAccessToken();
			queryClient.removeQueries();
			queryClient.clear();
			await navigate({ to: "/", replace: true });
		},
	});
};
