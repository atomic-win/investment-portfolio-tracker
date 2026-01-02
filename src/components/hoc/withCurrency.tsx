import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { useUserQuery } from '@/hooks/users';

export default function withCurrency<T extends { currency: string }>(
	Component: React.ComponentType<T>
) {
	return function WithCurrency(props: Omit<T, 'currency'>) {
		const { data: user, isFetching, error } = useUserQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching currency' />;
		}

		if (error || !user || !user.preferredCurrency) {
			return (
				<ErrorComponent errorMessage='Failed while fetching currency' />
			);
		}

		return (
			<Component {...(props as T)} currency={user.preferredCurrency} />
		);
	};
}
