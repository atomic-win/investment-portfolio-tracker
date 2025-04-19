import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { useMySettingsQuery } from '@/hooks/useMySettingsQuery';

export default function withCurrency<T extends { currency: string }>(
	Component: React.ComponentType<T>
) {
	return function WithCurrency(props: Omit<T, 'currency'>) {
		const { data: settings, isFetching, error } = useMySettingsQuery();

		console.log({
			settings,
			isFetching,
			error,
		});

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching currency' />;
		}

		if (error || !settings || !settings.currency) {
			return <ErrorComponent errorMessage='Failed while fetching currency' />;
		}

		return <Component {...(props as T)} currency={settings.currency} />;
	};
}
