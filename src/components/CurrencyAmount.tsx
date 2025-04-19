import { useMySettingsQuery } from '@/hooks/useMySettingsQuery';
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
	const { data: settings, isFetching, error } = useMySettingsQuery();

	if (isFetching || error || !settings) {
		return '';
	}

	return displayCurrencyAmountText(
		settings.language!,
		settings.currency!,
		amount,
		notation,
		numberOfFractionDigits
	);
}
