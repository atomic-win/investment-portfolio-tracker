import { useMyProfileQuery } from '@/hooks/useMyProfileQuery';
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
	const { data: profile, isFetching, error } = useMyProfileQuery();

	if (isFetching || error || !profile) {
		return '';
	}

	return displayCurrencyAmountText(
		profile.preferredLocale,
		profile.preferredCurrency,
		amount,
		notation,
		numberOfFractionDigits
	);
}
