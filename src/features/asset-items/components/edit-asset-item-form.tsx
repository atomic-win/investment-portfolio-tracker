import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEditAssetItemMutation } from "@/features/asset-items/hooks/asset-items";
import {
	type EditAssetItemRequest,
	EditAssetItemSchema,
} from "@/features/asset-items/schema";
import type { AssetItem } from "@/types";

export default function EditAssetItemForm({
	assetItem,
}: {
	assetItem: AssetItem;
}) {
	const { mutateAsync: editAssetItemAsync } = useEditAssetItemMutation();
	const router = useRouter();

	const form = useForm<z.infer<typeof EditAssetItemSchema>>({
		resolver: zodResolver(EditAssetItemSchema),
		defaultValues: {
			name: assetItem.name,
		},
	});

	async function onSubmit(data: Omit<EditAssetItemRequest, "assetItemId">) {
		await editAssetItemAsync({
			...data,
			assetItemId: assetItem.id,
		});
		router.history.back();
	}

	return (
		<CardContent className="p-0">
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
				<FieldGroup>
					<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Asset Item Name</FieldLabel>
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
					<div className="flex justify-end">
						<Button
							type="submit"
							className="cursor-pointer"
							disabled={!form.formState.isDirty || form.formState.isSubmitting}
						>
							Save
						</Button>
					</div>
				</FieldGroup>
			</form>
		</CardContent>
	);
}
