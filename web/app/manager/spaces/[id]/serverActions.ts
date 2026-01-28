"use server";

import { apiPost } from "@/utils/api";

export async function addNewItemToSpace(userId: number) {
	const createItemResponse = await apiPost("/space/manager/item", {
		text: "New Item",
		linkUrl: "https://google.com",
	});
	const item = await createItemResponse.json();

	const linkItemResponse = await apiPost("/space/manager/linkItem", {
		userId,
		spaceItemId: item.id,
		order: 0,
	});
}
export async function deleteItemFromSpace(itemId: number, userId: number) {
	return;
}
