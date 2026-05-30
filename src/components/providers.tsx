import { GoogleOAuthProvider } from "@react-oauth/google";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export function setupQueryClientPersistence(queryClient: QueryClient) {
	if (typeof window !== "undefined") {
		const localStoragePersister = createAsyncStoragePersister({
			storage: localStorage,
		});
		persistQueryClient({
			queryClient,
			persister: localStoragePersister,
		});
	}
}

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			{children}
		</GoogleOAuthProvider>
	);
}
