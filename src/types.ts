export enum IdentityProvider {
	Google = 'Google',
}

export enum Currency {
	Unknown = 'UNKNOWN',
	USD = 'USD',
	INR = 'INR',
}

export enum Language {
	EN = 'en',
	EN_US = 'en-US',
	EN_IN = 'en-IN',
}

export type AuthClaims = {
	userId: string;
};
