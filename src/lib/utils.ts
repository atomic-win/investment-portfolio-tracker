import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import _ from 'lodash';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calculateLocaleOptions(ipDataLocales: string[]) {
	const locales = _.uniq([...ipDataLocales, 'en', 'en-US']).filter(
		(locale) => locale === 'en' || locale.startsWith('en-')
	);

	const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales, {
		localeMatcher: 'best fit',
	});

	supportedLocales.sort((a, b) => b.length - a.length);
	return supportedLocales;
}

export function displayCurrencyAmountText(
	locale: string,
	currency: string,
	amount: number,
	notation: 'standard' | 'compact',
	maximumFractionDigits: number
) {
	return Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		currencyDisplay: 'symbol',
		maximumFractionDigits,
		notation,
	}).format(amount);
}
export function displayPercentage(percent: number) {
	return Intl.NumberFormat('en-IN', {
		style: 'percent',
		maximumFractionDigits: 2,
	}).format(percent / 100);
}
