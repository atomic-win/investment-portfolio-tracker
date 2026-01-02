import { useUserQuery } from '@/hooks/users';
import { displayCurrencyAmountText } from '@/lib/utils';

export default function CurrencyAmount({
	amount,
	notation = 'standard',
	numberOfFractionDigits = 2,
}: {
	amount: number;
	notation?: 'standard' | 'compact';
	numberOfFractionDigits?: number;
}) {
	const { data: user, isFetching, error } = useUserQuery();

	if (isFetching || error || !user) {
		return '';
	}

	return displayCurrencyAmountText(
		user.preferredLocale,
		user.preferredCurrency,
		amount,
		notation,
		numberOfFractionDigits
	);
}
