import { isAmountRequired } from '@/features/transactions/lib/utils';
import { TransactionType } from '@/types';
import z from 'zod';

export type AddTransactionRequest = z.infer<typeof TransactionFormSchema> & {
	assetItemId: string;
};

export type EditTransactionRequest = z.infer<typeof TransactionFormSchema> & {
	assetItemId: string;
	transactionId: string;
};

export const TransactionFormSchema = z
	.object({
		date: z.coerce.date({
			required_error: 'Transaction date is required',
		}),
		name: z
			.string()
			.min(3, {
				message: 'Transaction name must be at least 3 characters',
			})
			.max(1000, {
				message: 'Transaction name must be at most 1000 characters',
			}),
		transactionType: z.nativeEnum(TransactionType, {
			required_error: 'Transaction type is required',
		}),
		units: z.coerce.number().min(0, {
			message: 'Units must be at least 0',
		}),
		price: z.coerce.number().min(0, {
			message: 'Price must be at least 0',
		}),
		amount: z.coerce.number().min(0, {
			message: 'Amount must be at least 0',
		}),
	})
	.superRefine((data, ctx) => {
		if (isAmountRequired(data.transactionType)) {
			if (data.amount <= 0) {
				ctx.addIssue({
					code: 'invalid_arguments',
					message: `Amount must be greater than 0 for ${data.transactionType} transactions`,
					path: ['amount'],
					argumentsError: new z.ZodError([]),
				});
			}
		} else {
			if (data.units <= 0) {
				ctx.addIssue({
					code: 'invalid_arguments',
					message: `Units must be greater than 0 for ${data.transactionType} transactions`,
					path: ['units'],
					argumentsError: new z.ZodError([]),
				});
			}

			if (data.price <= 0) {
				ctx.addIssue({
					code: 'invalid_arguments',
					message: `Price must be greater than 0 for ${data.transactionType} transactions`,
					path: ['price'],
					argumentsError: new z.ZodError([]),
				});
			}
		}
	});
