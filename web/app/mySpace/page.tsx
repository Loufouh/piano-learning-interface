"use server";

import Link from "next/link";
import { apiGet } from "@/utils/api";
import type { SpaceItemType } from "../types/SpaceItemType";

export default async function MySpace() {
	const response = await apiGet("/space/myItems");
	const body = await response.json();
	const items = body.items as SpaceItemType[];

	return (
		<div>
			<h1 className="mb-10 font-bold text-3xl">My Space</h1>
			<div className="flex flex-col items-center gap-12">
				{items.map((item) => {
					return (
						<Link
							className="p-4 border-2 border-blue-600 hover:border-blue-400 rounded-2xl text-blue-600 hover:text-blue-400"
							href={item.linkUrl}
							key={item.id}
						>
							<p>{item.text}</p>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
