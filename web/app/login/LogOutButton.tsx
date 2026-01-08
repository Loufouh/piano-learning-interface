"use client";

import { useRouter } from "next/navigation";
import { logout } from "./serverActions";

export default function LogOutButton() {
	const router = useRouter();

	const handleClick = async () => {
		logout();
		router.refresh();
	};
	return (
		<button
			type="button"
			className="bg-blue-800 p-2 rounded text-white cursor-pointer"
			onClick={handleClick}
		>
			Se déconnecter
		</button>
	);
}
