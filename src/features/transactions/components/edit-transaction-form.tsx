import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import _ from "lodash";
import { DateTime } from "luxon";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import ErrorComponent from "@/components/error-component";
import LoadingComponent from "@/components/loading-component";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useEditTransactionMutation,
	useTransactionQuery,
} from "@/features/transactions/hooks/transactions";
import {
	displayTransactionTypeText,
	getApplicableTransactionTypes,
	getUnitLabelText,
	isAmountRequired,
} from "@/features/transactions/lib/utils";
import {
	type EditTransactionRequest,
	TransactionFormSchema,
} from "@/features/transactions/schema";
import type { AssetItemPortfolio, Transaction, TransactionType } from "@/types";

export default function EditTransactionForm({
	assetItem,
	transactionId,
}: {
	assetItem: AssetItemPortfolio;
	transactionId: string;
}) {
	const {
		data: transaction,
		isFetching,
		isError,
	} = useTransactionQuery(assetItem.id, transactionId, assetItem.currency);

	if (isFetching) {
		return <LoadingComponent loadingMessage="Fetching transaction" />;
	}

	if (isError || !transaction) {
		return <ErrorComponent errorMessage="Failed while fetching transaction" />;
	}

	return <Form assetItem={assetItem} transaction={transaction} />;
}

function Form({
	assetItem,
	transaction,
}: {
	assetItem: AssetItemPortfolio;
	transaction: Transaction;
}) {
	const { mutateAsync: editTransactionAsync } = useEditTransactionMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof TransactionFormSchema>>({
		resolver: zodResolver(TransactionFormSchema),
		defaultValues: {
			date: DateTime.fromISO(transaction.date).toJSDate(),
			name: transaction.name,
			transactionType: transaction.transactionType,
			units: transaction.units,
			price: transaction.price,
			amount: transaction.amount,
		},
	});

	async function onSubmit(
		data: Omit<EditTransactionRequest, "assetItemId" | "transactionId">,
	) {
		try {
			await editTransactionAsync({
				..._.pickBy(
					data,
					(value, key) =>
						value !== form.formState.defaultValues?.[key as keyof typeof data],
				),
				assetItemId: assetItem.id,
				transactionId: transaction.id,
			} as EditTransactionRequest);
			toast.success("Transaction updated successfully");
			router.history.back();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update transaction",
			);
		}
	}

	return (
		<CardContent className="p-0">
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col space-y-4"
			>
				<FieldGroup>
					<Field data-invalid={false}>
						<FieldLabel>Transaction Date</FieldLabel>
						<DatePicker date={DateTime.fromISO(transaction.date).toJSDate()} />
					</Field>
					<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Transaction Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="transactionType"
						render={({ field: { onChange, ...field }, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Transaction Type</FieldLabel>
								<Select {...field} onValueChange={onChange}>
									<SelectTrigger
										className="w-full rounded-lg sm:ml-auto"
										aria-label="Select a value"
										aria-invalid={fieldState.invalid}
										id={field.name}
										onBlur={field.onBlur}
									>
										<SelectValue title="Select a transaction type">
											{displayTransactionTypeText(
												field.value as TransactionType,
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										{getApplicableTransactionTypes(assetItem.assetType).map(
											(type) => (
												<SelectItem
													key={type}
													value={type}
													className="rounded-lg"
												>
													{displayTransactionTypeText(type)}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					{!isAmountRequired(form.watch("transactionType")) && (
						<>
							<Controller
								control={form.control}
								name="units"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>
											{getUnitLabelText(
												assetItem,
												form.watch("transactionType"),
											)}
										</FieldLabel>
										<Input
											{...field}
											type="number"
											id={field.name}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="price"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Price ({assetItem.currency})</FieldLabel>
										<Input
											{...field}
											type="number"
											id={field.name}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</>
					)}
					{isAmountRequired(form.watch("transactionType")) && (
						<Controller
							control={form.control}
							name="amount"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Amount ({assetItem.currency})</FieldLabel>
									<Input
										{...field}
										type="number"
										id={field.name}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					)}
					<div className="flex justify-end">
						<Button
							type="submit"
							className="cursor-pointer"
							disabled={!form.formState.isDirty || form.formState.isSubmitting}
						>
							Edit Transaction
						</Button>
					</div>
				</FieldGroup>
			</form>
		</CardContent>
	);
}
