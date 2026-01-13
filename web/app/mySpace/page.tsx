"use server";

import { apiGet } from "@/utils/api";
import type { SpaceItemType } from "../types/SpaceItemType";

export default async function MySpace() {
	const response = await apiGet("/space/myItems");
	const body = await response.json();
	const items = body.items as SpaceItemType[];

	console.log("response:", items);

	return (
		<div>
			<h1 className="mb-10 font-bold text-3xl">My Space</h1>
			<div className="flex flex-col items-center gap-12">
				{items.map((item) => {
					return (
						<div
							className="p-4 border-2 border-black rounded-2xl"
							key={item.id}
						>
							<p>{item.text}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
