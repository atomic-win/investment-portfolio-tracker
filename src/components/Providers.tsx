'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60, // 60 minutes
			staleTime: 1000 * 60 * 30, // 30 minutes
			refetchOnWindowFocus: true,
		},
	},
});

const ISSERVER = typeof window === 'undefined';

if (!ISSERVER) {
	const localStoragePersister = createAsyncStoragePersister({
		storage: localStorage,
	});

	persistQueryClient({
		queryClient,
		persister: localStoragePersister,
	});
}

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId='73478229232-4shu2tigpasb0drjlsn39g4isdm6kuv3.apps.googleusercontent.com'>
				<SidebarProvider>
					<AppSidebar />
					<main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
						{children}
						<ReactQueryDevtools />
					</main>
				</SidebarProvider>
			</GoogleOAuthProvider>
		</QueryClientProvider>
	);
}
