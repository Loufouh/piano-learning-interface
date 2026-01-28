"use server";

import type { SpaceItemType } from "@/app/types/SpaceItemType";
import { apiGet } from "@/utils/api";
import EditSpaceItemForm from "./EditSpaceItemForm";

export default async function ModifySpaceItem({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const { id } = await params;

	const itemResponse = await apiGet(`/space/manager/item/${id}`);
	const item: SpaceItemType = await itemResponse.json();

	return (
		<div className="flex flex-col items-center">
			<EditSpaceItemForm item={item} />
		</div>
	);
}
