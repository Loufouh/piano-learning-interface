"use client";

import { useRouter } from "next/navigation";
import { addNewItemToSpace } from "./serverActions";

export default function AddItemButton({ userId }: { userId: number }) {
	const router = useRouter();

	const handleClick = async () => {
		await addNewItemToSpace(userId);
		router.refresh();
	};
	return (
		<button
			type="button"
			onClick={handleClick}
			className="bg-blue-600 p-2 rounded-full w-15 h-15 font-bold text-white text-3xl cursor-pointer"
		>
			+
		</button>
	);
}
