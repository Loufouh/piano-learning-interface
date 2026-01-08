"use server";

import Link from "next/link";
import { isConnected } from "@/utils/auth";
import LogOutButton from "../login/LogOutButton";

export default async function NavBar() {
	const isUserConnected = await isConnected();

	return (
		<nav className="bg-blue-300 p-3 h-25">
			<ul className="flex flex-row justify-end items-center gap-10">
				{isUserConnected ? (
					<LogOutButton />
				) : (
					<Link href="/login" className="bg-orange-400 p-2 rounded text-white">
						Se connecter
					</Link>
				)}
			</ul>
		</nav>
	);
}
