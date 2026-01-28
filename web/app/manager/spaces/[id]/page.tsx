"use server";

import Link from "next/link";
import type { SpaceItemType } from "@/app/types/SpaceItemType";
import type { UserType } from "@/app/types/UserType";
import { apiGet } from "@/utils/api";
import AddItemButton from "./AddItemButton";
import DeleteItemButton from "./DeleteItemButton";

export default async function ManageSpace({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const userResponse = await apiGet(`/user/${id}`);
	const user: UserType = await userResponse.json();

	const spaceItemsResponse = await apiGet(`/space/manager/itemsOfUser/${id}`);
	const spaceItems: SpaceItemType[] = (await spaceItemsResponse.json()).items;

	return (
		<div className="flex flex-col items-center">
			<h1 className="mt-5 mb-10 font-bold text-3xl">{user.name}</h1>
			<ul className="flex flex-col items-center gap-5">
				<AddItemButton userId={Number(id)} />
				<button type="button"></button>
				{spaceItems.map((item: SpaceItemType) => (
					<div key={item.id} className="items-center gap-3 grid grid-cols-5">
						<DeleteItemButton itemId={item.id} userId={id} />
						<Link
							className="col-span-3 p-4 border-2 border-blue-600 hover:border-blue-400 rounded-2xl text-blue-600 hover:text-blue-400"
							href={item.linkUrl}
						>
							<p>{item.text}</p>
						</Link>
						<Link
							className="bg-orange-300 p-2 rounded w-10 h-10 text-white"
							href={`/manager/spaces/items/edit/${item.id}`}
						>
							Edit
						</Link>
					</div>
				))}
			</ul>
		</div>
	);
}
