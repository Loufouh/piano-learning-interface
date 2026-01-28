"use client";

import { useRouter } from "next/navigation";
import { deleteItemFromSpace } from "./serverActions";

export default function AddItemButton({
	itemId,
	userId,
}: {
	itemId: number;
	userId: number;
}) {
	const router = useRouter();

	const handleClick = async () => {
		await deleteItemFromSpace(itemId, userId);
		router.refresh();
	};
	return (
		<button
			type="button"
			onClick={handleClick}
			className="bg-red-600 p-1 rounded-full w-10 h-10 font-bold text-white text-2xl cursor-pointer"
		>
			x
		</button>
	);
}
