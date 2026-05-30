import { QueryClient } from "@tanstack/react-query";

import { setupQueryClientPersistence } from "@/components/Providers";

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: 1000 * 60 * 60,
				staleTime: 1000 * 60 * 30,
				refetchOnWindowFocus: true,
			},
		},
	});

	setupQueryClientPersistence(queryClient);

	return {
		queryClient,
	};
}

export default function TanstackQueryProvider() {}
