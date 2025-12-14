import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { useMyProfileQuery } from '@/hooks/useMyProfileQuery';

export default function withCurrency<T extends { currency: string }>(
	Component: React.ComponentType<T>
) {
	return function WithCurrency(props: Omit<T, 'currency'>) {
		const { data: profile, isFetching, error } = useMyProfileQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching currency' />;
		}

		if (error || !profile || !profile.preferredCurrency) {
			return (
				<ErrorComponent errorMessage='Failed while fetching currency' />
			);
		}

		return (
			<Component {...(props as T)} currency={profile.preferredCurrency} />
		);
	};
}
