import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useLogOutMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async () => {
			localStorage.removeItem("accessToken");
			queryClient.removeQueries();
			queryClient.clear();
			navigate({ to: "/", replace: true });
		},
	});
};
